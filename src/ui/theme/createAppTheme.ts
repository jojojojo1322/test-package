import { createTheme, responsiveFontSizes, type ThemeOptions } from "@mui/material/styles";

const baseThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0066FF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1F2937",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.75rem", fontWeight: 700 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
};

const mergeThemeOptions = (overrides?: ThemeOptions): ThemeOptions => {
  if (!overrides) {
    return baseThemeOptions;
  }

  return {
    ...baseThemeOptions,
    ...overrides,
    palette: {
      ...baseThemeOptions.palette,
      ...overrides.palette,
    },
    components: {
      ...baseThemeOptions.components,
      ...overrides.components,
    },
    typography: {
      ...baseThemeOptions.typography,
      ...overrides.typography,
    },
    shape: {
      ...baseThemeOptions.shape,
      ...overrides.shape,
    },
  };
};

export const createAppTheme = (overrides?: ThemeOptions) =>
  responsiveFontSizes(createTheme(mergeThemeOptions(overrides)));

export type { ThemeOptions };
