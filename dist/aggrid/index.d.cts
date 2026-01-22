import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';
import { AgGridReactProps } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
export { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

type GridTheme = "quartz" | "alpine" | "balham" | "material";
interface AgGridWrapperProps<TData = unknown> extends Omit<AgGridReactProps<TData>, "rowData" | "columnDefs" | "theme"> {
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
interface AgGridWrapperRef<TData = unknown> {
    getApi: () => GridApi<TData> | undefined;
}
declare function AgGridWrapperInner<TData = unknown>({ rowData, columnDefs, licenseKey, height, width, className, style, theme, darkMode, onGridApiReady, onGridReady, defaultColDef, ...rest }: AgGridWrapperProps<TData>, ref: React.ForwardedRef<AgGridWrapperRef<TData>>): react_jsx_runtime.JSX.Element;
declare const AgGridWrapper: <TData = unknown>(props: AgGridWrapperProps<TData> & {
    ref?: React.ForwardedRef<AgGridWrapperRef<TData>>;
}) => ReturnType<typeof AgGridWrapperInner>;

export { AgGridWrapper, type AgGridWrapperProps, type AgGridWrapperRef };
