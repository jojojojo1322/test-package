import { ResponsiveContainer, PieChart, Tooltip, Legend, Pie, Cell, AreaChart, CartesianGrid, XAxis, YAxis, Area, BarChart, Bar, LineChart, Line } from 'recharts';
export { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/chart/ChartWrapper.tsx
var DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE"
];
var ChartWrapper = ({
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
  children
}) => {
  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style
  };
  const renderLineChart = () => /* @__PURE__ */ jsxs(LineChart, { data, children: [
    showGrid && /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsx(YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsx(Tooltip, {})),
    showLegend && /* @__PURE__ */ jsx(Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsx(
      Line,
      {
        type: "monotone",
        dataKey: s.dataKey,
        name: s.name ?? s.dataKey,
        stroke: s.color ?? colors[index % colors.length],
        fill: s.color ?? colors[index % colors.length]
      },
      s.dataKey
    )),
    children
  ] });
  const renderBarChart = () => /* @__PURE__ */ jsxs(BarChart, { data, children: [
    showGrid && /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsx(YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsx(Tooltip, {})),
    showLegend && /* @__PURE__ */ jsx(Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsx(
      Bar,
      {
        dataKey: s.dataKey,
        name: s.name ?? s.dataKey,
        fill: s.color ?? colors[index % colors.length],
        stackId: s.stackId
      },
      s.dataKey
    )),
    children
  ] });
  const renderAreaChart = () => /* @__PURE__ */ jsxs(AreaChart, { data, children: [
    showGrid && /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsx(YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsx(Tooltip, {})),
    showLegend && /* @__PURE__ */ jsx(Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsx(
      Area,
      {
        type: "monotone",
        dataKey: s.dataKey,
        name: s.name ?? s.dataKey,
        stroke: s.color ?? colors[index % colors.length],
        fill: s.color ?? colors[index % colors.length],
        stackId: s.stackId
      },
      s.dataKey
    )),
    children
  ] });
  const renderPieChart = () => {
    const pieDataKey = series[0]?.dataKey ?? "value";
    return /* @__PURE__ */ jsxs(PieChart, { children: [
      showTooltip && (customTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsx(Tooltip, {})),
      showLegend && /* @__PURE__ */ jsx(Legend, {}),
      /* @__PURE__ */ jsx(
        Pie,
        {
          data,
          dataKey: pieDataKey,
          nameKey: xAxisDataKey,
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          label: true,
          children: data.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))
        }
      ),
      children
    ] });
  };
  const renderChart = () => {
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
  return /* @__PURE__ */ jsx("div", { className, style: containerStyle, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: renderChart() }) });
};

export { ChartWrapper, DEFAULT_COLORS };
//# sourceMappingURL=chunk-EZPPA2PJ.js.map
//# sourceMappingURL=chunk-EZPPA2PJ.js.map