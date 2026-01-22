export { ChartWrapper, DEFAULT_COLORS } from "./ChartWrapper";
export type {
  ChartWrapperProps,
  ChartType,
  ChartDataItem,
  ChartSeriesConfig,
} from "./ChartWrapper";

// re-export commonly used components from recharts
export {
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
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
