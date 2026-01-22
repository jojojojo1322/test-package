import { CSSProperties, ReactNode, ReactElement } from 'react';
import { TooltipProps } from 'recharts';
export { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

declare const DEFAULT_COLORS: string[];
type ChartType = "line" | "bar" | "area" | "pie";
interface ChartDataItem {
    name: string;
    [key: string]: string | number;
}
interface ChartSeriesConfig {
    dataKey: string;
    name?: string;
    color?: string;
    stackId?: string;
}
interface ChartWrapperProps {
    type: ChartType;
    data: ChartDataItem[];
    series: ChartSeriesConfig[];
    height?: number | string;
    width?: number | string;
    style?: CSSProperties;
    className?: string;
    xAxisDataKey?: string;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    colors?: string[];
    customTooltip?: React.FC<TooltipProps<number, string>>;
    children?: ReactNode;
}
declare const ChartWrapper: ({ type, data, series, height, width, style, className, xAxisDataKey, showGrid, showTooltip, showLegend, colors, customTooltip, children, }: ChartWrapperProps) => ReactElement;

export { type ChartDataItem, type ChartSeriesConfig, type ChartType, ChartWrapper, type ChartWrapperProps, DEFAULT_COLORS };
