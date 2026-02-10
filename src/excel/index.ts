import * as XLSX from "xlsx";

export type ExcelFieldType = "string" | "number" | "date" | "boolean" | "json";

export type ExcelSchemaField<T extends string> = {
	key: T;
	aliases: string[];
	required?: boolean;
	type?: ExcelFieldType;
	transform?: (value: unknown, context: { raw: unknown; row: unknown[] }) => unknown;
};

export type ParseExcelOptions<T extends string> = {
	schema: ExcelSchemaField<T>[];
	sheetName?: string;
	headerRow?: number;
	headerScanRows?: number;
	allowFuzzyHeader?: boolean;
	fuzzyThreshold?: number;
	normalizeHeader?: (value: string) => string;
	keepEmptyRows?: boolean;
};

export type ParseExcelErrorCode =
	| "missing_header"
	| "missing_required"
	| "invalid_type";

export type ParseExcelError<T extends string> = {
	rowIndex: number;
	key: T;
	code: ParseExcelErrorCode;
	value?: unknown;
	message: string;
};

export type ParseExcelResult<T extends string> = {
	rows: Record<T, unknown | null>[];
	errors: ParseExcelError<T>[];
	meta: {
		sheetName: string;
		headerRow: number;
		colMap: Record<T, number | null>;
		totalRows: number;
	};
};

const defaultNormalizeHeader = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "")
		.replace(/[^\p{L}\p{N}]/gu, "");

const isEmptyCell = (value: unknown) =>
	value == null || (typeof value === "string" && value.trim() === "");

const isEmptyRow = (row: unknown[]) => row.length === 0 || row.every(isEmptyCell);

const levenshtein = (a: string, b: string) => {
	if (a === b) return 0;
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const matrix = Array.from({ length: a.length + 1 }, (_, i) => {
		const row = new Array<number>(b.length + 1);
		row[0] = i;
		return row;
	});

	for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;

	for (let i = 1; i <= a.length; i += 1) {
		for (let j = 1; j <= b.length; j += 1) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost,
			);
		}
	}

	return matrix[a.length][b.length];
};

const similarity = (a: string, b: string) => {
	const maxLen = Math.max(a.length, b.length);
	if (maxLen === 0) return 1;
	return 1 - levenshtein(a, b) / maxLen;
};

const findHeaderIndex = (
	headers: string[],
	aliases: string[],
	normalizeHeader: (value: string) => string,
	allowFuzzy: boolean,
	threshold: number,
	exclude: Set<number>,
) => {
	const normalizedHeaders = headers.map(normalizeHeader);
	const normalizedAliases = aliases.map(normalizeHeader);

	for (const alias of normalizedAliases) {
		const idx = normalizedHeaders.findIndex(
			(header, index) => header === alias && !exclude.has(index),
		);
		if (idx !== -1) return idx;
	}

	if (!allowFuzzy) return null;

	let bestIndex: number | null = null;
	let bestScore = 0;

	for (let i = 0; i < normalizedHeaders.length; i += 1) {
		if (exclude.has(i)) continue;
		for (const alias of normalizedAliases) {
			const score = similarity(normalizedHeaders[i], alias);
			if (score > bestScore) {
				bestScore = score;
				bestIndex = i;
			}
		}
	}

	return bestScore >= threshold ? bestIndex : null;
};

const buildColumnMap = <T extends string>(
	headers: string[],
	schema: ExcelSchemaField<T>[],
	normalizeHeader: (value: string) => string,
	allowFuzzy: boolean,
	threshold: number,
): Record<T, number | null> => {
	const colMap = {} as Record<T, number | null>;
	const used = new Set<number>();

	for (const field of schema) {
		const idx = findHeaderIndex(
			headers,
			field.aliases,
			normalizeHeader,
			allowFuzzy,
			threshold,
			used,
		);
		if (idx != null) used.add(idx);
		colMap[field.key] = idx ?? null;
	}

	return colMap;
};

const scoreHeaderRow = <T extends string>(
	headers: string[],
	schema: ExcelSchemaField<T>[],
	normalizeHeader: (value: string) => string,
	allowFuzzy: boolean,
	threshold: number,
) => {
	let score = 0;
	for (const field of schema) {
		const idx = findHeaderIndex(
			headers,
			field.aliases,
			normalizeHeader,
			allowFuzzy,
			threshold,
			new Set(),
		);
		if (idx != null) score += 1;
	}
	return score;
};

const detectHeaderRow = <T extends string>(
	rows: unknown[][],
	schema: ExcelSchemaField<T>[],
	scanRows: number,
	normalizeHeader: (value: string) => string,
	allowFuzzy: boolean,
	threshold: number,
) => {
	let bestRow = 0;
	let bestScore = -1;

	for (let r = 0; r < Math.min(scanRows, rows.length); r += 1) {
		const headers = (rows[r] ?? []).map((cell) =>
			cell == null ? "" : String(cell),
		);
		const score = scoreHeaderRow(
			headers,
			schema,
			normalizeHeader,
			allowFuzzy,
			threshold,
		);
		if (score > bestScore) {
			bestScore = score;
			bestRow = r;
		}
	}

	return bestRow;
};

const excelNumberToDate = (value: number) => {
	const parsed = XLSX.SSF.parse_date_code(value);
	if (!parsed || !parsed.y || !parsed.m || !parsed.d) return null;
	return new Date(
		parsed.y,
		parsed.m - 1,
		parsed.d,
		parsed.H ?? 0,
		parsed.M ?? 0,
		Math.floor(parsed.S ?? 0),
	);
};

const coerceValue = (type: ExcelFieldType | undefined, raw: unknown) => {
	if (raw == null || raw === "") return { value: null as unknown, error: null };

	if (!type) return { value: raw, error: null };

	switch (type) {
		case "string": {
			return { value: String(raw).trim(), error: null };
		}
		case "number": {
			if (typeof raw === "number" && Number.isFinite(raw)) {
				return { value: raw, error: null };
			}
			const text = String(raw).replace(/,/g, "").trim();
			const num = Number(text);
			if (!Number.isFinite(num)) {
				return { value: null, error: "Number conversion failed" };
			}
			return { value: num, error: null };
		}
		case "boolean": {
			if (typeof raw === "boolean") return { value: raw, error: null };
			if (typeof raw === "number") {
				if (raw === 1) return { value: true, error: null };
				if (raw === 0) return { value: false, error: null };
			}
			const text = String(raw).trim().toLowerCase();
			if (["true", "t", "yes", "y", "1"].includes(text)) {
				return { value: true, error: null };
			}
			if (["false", "f", "no", "n", "0"].includes(text)) {
				return { value: false, error: null };
			}
			return { value: null, error: "Boolean conversion failed" };
		}
		case "date": {
			if (raw instanceof Date) return { value: raw, error: null };
			if (typeof raw === "number") {
				const parsed = excelNumberToDate(raw);
				if (!parsed) return { value: null, error: "Date conversion failed" };
				return { value: parsed, error: null };
			}
			const parsed = new Date(String(raw));
			if (Number.isNaN(parsed.getTime())) {
				return { value: null, error: "Date conversion failed" };
			}
			return { value: parsed, error: null };
		}
		case "json": {
			if (typeof raw !== "string") return { value: raw, error: null };
			try {
				return { value: JSON.parse(raw), error: null };
			} catch {
				return { value: null, error: "JSON parse failed" };
			}
		}
		default:
			return { value: raw, error: null };
	}
};

export const parseExcelToJson = <T extends string>(
	buffer: ArrayBuffer | Uint8Array,
	options: ParseExcelOptions<T>,
): ParseExcelResult<T> => {
	const normalizeHeader = options.normalizeHeader ?? defaultNormalizeHeader;
	const allowFuzzyHeader = options.allowFuzzyHeader ?? true;
	const fuzzyThreshold = options.fuzzyThreshold ?? 0.7;
	const headerScanRows = options.headerScanRows ?? 10;

	const seenKeys = new Set<T>();
	for (const field of options.schema) {
		if (seenKeys.has(field.key)) {
			throw new Error(`Duplicate schema key: ${field.key}`);
		}
		seenKeys.add(field.key);
	}

	const data = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
	const workbook = XLSX.read(data, { type: "array", cellDates: true });
	const sheetName = options.sheetName ?? workbook.SheetNames[0];
	if (!sheetName) {
		throw new Error("Excel sheet not found.");
	}
	const sheet = workbook.Sheets[sheetName];
	if (!sheet) {
		throw new Error(`Excel sheet not found: ${sheetName}`);
	}

	const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
		header: 1,
		raw: true,
		defval: null,
	});

	const headerRow =
		options.headerRow ??
		detectHeaderRow(
			rows,
			options.schema,
			headerScanRows,
			normalizeHeader,
			allowFuzzyHeader,
			fuzzyThreshold,
		);

	const headerCells = (rows[headerRow] ?? []).map((cell) =>
		cell == null ? "" : String(cell),
	);

	const colMap = buildColumnMap(
		headerCells,
		options.schema,
		normalizeHeader,
		allowFuzzyHeader,
		fuzzyThreshold,
	);

	const errors: ParseExcelError<T>[] = [];

	for (const field of options.schema) {
		if (field.required && colMap[field.key] == null) {
			errors.push({
				rowIndex: headerRow,
				key: field.key,
				code: "missing_header",
				message: "Required header not found.",
			});
		}
	}

	const resultRows: Record<T, unknown | null>[] = [];

	for (let i = headerRow + 1; i < rows.length; i += 1) {
		const rawRow = rows[i] ?? [];
		if (!options.keepEmptyRows && isEmptyRow(rawRow)) continue;

		const output = {} as Record<T, unknown | null>;

		for (const field of options.schema) {
			const colIndex = colMap[field.key];
			const raw = colIndex == null ? null : rawRow[colIndex];
			const { value, error } = coerceValue(field.type, raw);

			if (error) {
				errors.push({
					rowIndex: i,
					key: field.key,
					code: "invalid_type",
					value: raw,
					message: error,
				});
				output[field.key] = null;
				continue;
			}

			let finalValue = value;
			if (field.transform) {
				try {
					finalValue = field.transform(value, { raw, row: rawRow });
				} catch (err) {
					errors.push({
						rowIndex: i,
						key: field.key,
						code: "invalid_type",
						value: raw,
						message:
							err instanceof Error ? err.message : "Transform failed",
					});
					output[field.key] = null;
					continue;
				}
			}

			if (
				field.required &&
				(finalValue == null ||
					(typeof finalValue === "string" && finalValue.trim() === ""))
			) {
				errors.push({
					rowIndex: i,
					key: field.key,
					code: "missing_required",
					value: raw,
					message: "Required value is missing.",
				});
			}

			output[field.key] = finalValue ?? null;
		}

		resultRows.push(output);
	}

	return {
		rows: resultRows,
		errors,
		meta: {
			sheetName,
			headerRow,
			colMap,
			totalRows: rows.length,
		},
	};
};
