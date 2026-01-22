import type { CSSProperties, ReactNode, ReactElement } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  type TooltipProps,
} from "recharts";

// 기본 색상 팔레트
export const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

export interface ChartSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  stackId?: string;
}

export interface ChartWrapperProps {
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

export const ChartWrapper = ({
  type,
  data,
  series,
  height = 300,
  width = "100%",
  style,
  className,
  xAxisDataKey = "name",
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  colors = DEFAULT_COLORS,
  customTooltip,
  children,
}: ChartWrapperProps): ReactElement => {
  const containerStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  const renderLineChart = (): ReactElement => (
    <LineChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      {showTooltip && (customTooltip ? <Tooltip content={customTooltip} /> : <Tooltip />)}
      {showLegend && <Legend />}
      {series.map((s, index) => (
        <Line
          key={s.dataKey}
          type="monotone"
          dataKey={s.dataKey}
          name={s.name ?? s.dataKey}
          stroke={s.color ?? colors[index % colors.length]}
          fill={s.color ?? colors[index % colors.length]}
        />
      ))}
      {children}
    </LineChart>
  );

  const renderBarChart = (): ReactElement => (
    <BarChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      {showTooltip && (customTooltip ? <Tooltip content={customTooltip} /> : <Tooltip />)}
      {showLegend && <Legend />}
      {series.map((s, index) => (
        <Bar
          key={s.dataKey}
          dataKey={s.dataKey}
          name={s.name ?? s.dataKey}
          fill={s.color ?? colors[index % colors.length]}
          stackId={s.stackId}
        />
      ))}
      {children}
    </BarChart>
  );

  const renderAreaChart = (): ReactElement => (
    <AreaChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      {showTooltip && (customTooltip ? <Tooltip content={customTooltip} /> : <Tooltip />)}
      {showLegend && <Legend />}
      {series.map((s, index) => (
        <Area
          key={s.dataKey}
          type="monotone"
          dataKey={s.dataKey}
          name={s.name ?? s.dataKey}
          stroke={s.color ?? colors[index % colors.length]}
          fill={s.color ?? colors[index % colors.length]}
          stackId={s.stackId}
        />
      ))}
      {children}
    </AreaChart>
  );

  const renderPieChart = (): ReactElement => {
    const pieDataKey = series[0]?.dataKey ?? "value";

    return (
      <PieChart>
        {showTooltip && (customTooltip ? <Tooltip content={customTooltip} /> : <Tooltip />)}
        {showLegend && <Legend />}
        <Pie
          data={data}
          dataKey={pieDataKey}
          nameKey={xAxisDataKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {children}
      </PieChart>
    );
  };

  const renderChart = (): ReactElement => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "area":
        return renderAreaChart();
      case "pie":
        return renderPieChart();
    }
  };

  return (
    <div className={className} style={containerStyle}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
