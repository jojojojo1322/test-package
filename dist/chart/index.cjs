'use strict';

var recharts = require('recharts');
var jsxRuntime = require('react/jsx-runtime');

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
  const renderLineChart = () => /* @__PURE__ */ jsxRuntime.jsxs(recharts.LineChart, { data, children: [
    showGrid && /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {})),
    showLegend && /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Line,
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
  const renderBarChart = () => /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, children: [
    showGrid && /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {})),
    showLegend && /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Bar,
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
  const renderAreaChart = () => /* @__PURE__ */ jsxRuntime.jsxs(recharts.AreaChart, { data, children: [
    showGrid && /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.XAxis, { dataKey: xAxisDataKey }),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, {}),
    showTooltip && (customTooltip ? /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {})),
    showLegend && /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {}),
    series.map((s, index) => /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Area,
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
    return /* @__PURE__ */ jsxRuntime.jsxs(recharts.PieChart, { children: [
      showTooltip && (customTooltip ? /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, { content: customTooltip }) : /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {})),
      showLegend && /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {}),
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.Pie,
        {
          data,
          dataKey: pieDataKey,
          nameKey: xAxisDataKey,
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          label: true,
          children: data.map((_, index) => /* @__PURE__ */ jsxRuntime.jsx(recharts.Cell, { fill: colors[index % colors.length] }, `cell-${index}`))
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className, style: containerStyle, children: /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { width: "100%", height: "100%", children: renderChart() }) });
};

Object.defineProperty(exports, "Area", {
  enumerable: true,
  get: function () { return recharts.Area; }
});
Object.defineProperty(exports, "AreaChart", {
  enumerable: true,
  get: function () { return recharts.AreaChart; }
});
Object.defineProperty(exports, "Bar", {
  enumerable: true,
  get: function () { return recharts.Bar; }
});
Object.defineProperty(exports, "BarChart", {
  enumerable: true,
  get: function () { return recharts.BarChart; }
});
Object.defineProperty(exports, "CartesianGrid", {
  enumerable: true,
  get: function () { return recharts.CartesianGrid; }
});
Object.defineProperty(exports, "Cell", {
  enumerable: true,
  get: function () { return recharts.Cell; }
});
Object.defineProperty(exports, "ComposedChart", {
  enumerable: true,
  get: function () { return recharts.ComposedChart; }
});
Object.defineProperty(exports, "Legend", {
  enumerable: true,
  get: function () { return recharts.Legend; }
});
Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function () { return recharts.Line; }
});
Object.defineProperty(exports, "LineChart", {
  enumerable: true,
  get: function () { return recharts.LineChart; }
});
Object.defineProperty(exports, "Pie", {
  enumerable: true,
  get: function () { return recharts.Pie; }
});
Object.defineProperty(exports, "PieChart", {
  enumerable: true,
  get: function () { return recharts.PieChart; }
});
Object.defineProperty(exports, "PolarAngleAxis", {
  enumerable: true,
  get: function () { return recharts.PolarAngleAxis; }
});
Object.defineProperty(exports, "PolarGrid", {
  enumerable: true,
  get: function () { return recharts.PolarGrid; }
});
Object.defineProperty(exports, "PolarRadiusAxis", {
  enumerable: true,
  get: function () { return recharts.PolarRadiusAxis; }
});
Object.defineProperty(exports, "Radar", {
  enumerable: true,
  get: function () { return recharts.Radar; }
});
Object.defineProperty(exports, "RadarChart", {
  enumerable: true,
  get: function () { return recharts.RadarChart; }
});
Object.defineProperty(exports, "ResponsiveContainer", {
  enumerable: true,
  get: function () { return recharts.ResponsiveContainer; }
});
Object.defineProperty(exports, "Scatter", {
  enumerable: true,
  get: function () { return recharts.Scatter; }
});
Object.defineProperty(exports, "ScatterChart", {
  enumerable: true,
  get: function () { return recharts.ScatterChart; }
});
Object.defineProperty(exports, "Tooltip", {
  enumerable: true,
  get: function () { return recharts.Tooltip; }
});
Object.defineProperty(exports, "XAxis", {
  enumerable: true,
  get: function () { return recharts.XAxis; }
});
Object.defineProperty(exports, "YAxis", {
  enumerable: true,
  get: function () { return recharts.YAxis; }
});
exports.ChartWrapper = ChartWrapper;
exports.DEFAULT_COLORS = DEFAULT_COLORS;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map