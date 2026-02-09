import type { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import type { CSSProperties } from "react";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";

// CSS는 앱에서 import 해야함
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

export type AgGridInitMode = "enterprise" | "community";

export interface AgGridInitOptions {
	mode?: AgGridInitMode;
	licenseKey?: string;
}

// 모듈 등록 (한번만)
let modulesRegistered = false;
let registeredMode: AgGridInitMode | null = null;

const registerModules = (options: AgGridInitOptions = {}) => {
	if (modulesRegistered) return;

	const mode: AgGridInitMode =
		options.mode ?? (options.licenseKey ? "enterprise" : "community");

	if (mode === "enterprise") {
		if (!options.licenseKey) {
			throw new Error("AgGrid enterprise init requires a licenseKey.");
		}
		LicenseManager.setLicenseKey(options.licenseKey);
		ModuleRegistry.registerModules([AllEnterpriseModule]);
	} else {
		ModuleRegistry.registerModules([AllCommunityModule]);
	}

	registeredMode = mode;
	modulesRegistered = true;
};

export const initAgGridModules = (options: AgGridInitOptions = {}) => {
	registerModules(options);
};

const ensureModulesRegistered = (licenseKey?: string) => {
	if (!modulesRegistered) {
		if (licenseKey) {
			registerModules({ mode: "enterprise", licenseKey });
			return;
		}
		throw new Error(
			"AgGrid modules not initialized. Call initAgGridModules({ licenseKey }) or initAgGridModules({ mode: 'community' }).",
		);
	}

	if (registeredMode === "community" && licenseKey) {
		throw new Error(
			"AgGrid already initialized in community mode; licenseKey cannot be applied after initialization.",
		);
	}
};

export type GridTheme = "quartz" | "alpine" | "balham" | "material";

export interface AgGridWrapperProps<TData = unknown>
	extends Omit<AgGridReactProps<TData>, "rowData" | "columnDefs" | "theme"> {
	rowData: TData[];
	columnDefs: ColDef<TData>[];
	licenseKey?: string;
	height?: number | string;
	width?: number | string;
	className?: string;
	style?: CSSProperties;
	theme?: GridTheme;
	darkMode?: boolean;
	onGridApiReady?: (api: GridApi<TData>) => void;
}

export interface AgGridWrapperRef<TData = unknown> {
	getApi: () => GridApi<TData> | undefined;
}

function AgGridWrapperInner<TData = unknown>(
	{
		rowData,
		columnDefs,
		licenseKey,
		height = 400,
		width = "100%",
		className,
		style,
		theme = "quartz",
		darkMode = false,
		onGridApiReady,
		onGridReady,
		defaultColDef,
		...rest
	}: AgGridWrapperProps<TData>,
	ref: React.ForwardedRef<AgGridWrapperRef<TData>>,
) {
	const gridRef = useRef<AgGridReact<TData>>(null);

	// 모듈 등록 보장 (지연된 licenseKey 차단)
	ensureModulesRegistered(licenseKey);

	// ref로 API 접근
	useImperativeHandle(ref, () => ({
		getApi: () => gridRef.current?.api,
	}));

	const mergedDefaultColDef = useMemo<ColDef<TData>>(
		() => ({
			flex: 1,
			minWidth: 100,
			resizable: true,
			sortable: true,
			filter: true,
			...defaultColDef,
		}),
		[defaultColDef],
	);

	const handleGridReady = useCallback(
		(event: GridReadyEvent<TData>) => {
			onGridApiReady?.(event.api);
			onGridReady?.(event);
		},
		[onGridApiReady, onGridReady],
	);

	const themeClass = darkMode ? `ag-theme-${theme}-dark` : `ag-theme-${theme}`;

	const containerStyle: CSSProperties = {
		height: typeof height === "number" ? `${height}px` : height,
		width: typeof width === "number" ? `${width}px` : width,
		...style,
	};

	return (
		<div className={`${themeClass} ${className ?? ""}`} style={containerStyle}>
			<AgGridReact<TData>
				ref={gridRef}
				rowData={rowData}
				columnDefs={columnDefs}
				defaultColDef={mergedDefaultColDef}
				onGridReady={handleGridReady}
				animateRows
				{...rest}
			/>
		</div>
	);
}

export const AgGridWrapper = forwardRef(AgGridWrapperInner) as <
	TData = unknown,
>(
	props: AgGridWrapperProps<TData> & {
		ref?: React.ForwardedRef<AgGridWrapperRef<TData>>;
	},
) => ReturnType<typeof AgGridWrapperInner>;
