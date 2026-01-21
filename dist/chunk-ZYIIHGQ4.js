import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { useMemo } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// src/ui/theme/createAppTheme.ts
var baseThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0066FF",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#1F2937",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563"
    }
  },
  shape: {
    borderRadius: 10
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
      "sans-serif"
    ].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.75rem", fontWeight: 700 },
    button: { fontWeight: 600, textTransform: "none" }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
};
var mergeThemeOptions = (overrides) => {
  if (!overrides) {
    return baseThemeOptions;
  }
  return {
    ...baseThemeOptions,
    ...overrides,
    palette: {
      ...baseThemeOptions.palette,
      ...overrides.palette
    },
    components: {
      ...baseThemeOptions.components,
      ...overrides.components
    },
    typography: {
      ...baseThemeOptions.typography,
      ...overrides.typography
    },
    shape: {
      ...baseThemeOptions.shape,
      ...overrides.shape
    }
  };
};
var createAppTheme = (overrides) => responsiveFontSizes(createTheme(mergeThemeOptions(overrides)));
var AppThemeProvider = ({ children, themeOptions }) => {
  const theme = useMemo(() => {
    if (typeof themeOptions === "function") {
      const base = createAppTheme();
      return createAppTheme(themeOptions(base));
    }
    return createAppTheme(themeOptions);
  }, [themeOptions]);
  return /* @__PURE__ */ jsxs(ThemeProvider, { theme, children: [
    /* @__PURE__ */ jsx(CssBaseline, {}),
    /* @__PURE__ */ jsx(
      GlobalStyles,
      {
        styles: {
          body: { backgroundColor: theme.palette.background.default },
          "*": { boxSizing: "border-box" }
        }
      }
    ),
    children
  ] });
};
var PrimaryButton = ({
  loading = false,
  icon,
  children,
  disabled,
  ...rest
}) => /* @__PURE__ */ jsx(
  Button,
  {
    variant: "contained",
    color: "primary",
    disableElevation: true,
    disabled: disabled || loading,
    ...rest,
    children: /* @__PURE__ */ jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [
      loading && /* @__PURE__ */ jsx(CircularProgress, { size: 16, color: "inherit" }),
      !loading && icon,
      /* @__PURE__ */ jsx("span", { children })
    ] })
  }
);

export { AppThemeProvider, PrimaryButton, createAppTheme };
//# sourceMappingURL=chunk-ZYIIHGQ4.js.map
//# sourceMappingURL=chunk-ZYIIHGQ4.js.map