'use strict';

var styles = require('@mui/material/styles');
var material = require('@mui/material');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
var Button = require('@mui/material/Button');
var CircularProgress = require('@mui/material/CircularProgress');
var Stack = require('@mui/material/Stack');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Button__default = /*#__PURE__*/_interopDefault(Button);
var CircularProgress__default = /*#__PURE__*/_interopDefault(CircularProgress);
var Stack__default = /*#__PURE__*/_interopDefault(Stack);

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
var createAppTheme = (overrides) => styles.responsiveFontSizes(styles.createTheme(mergeThemeOptions(overrides)));
var AppThemeProvider = ({ children, themeOptions }) => {
  const theme = react.useMemo(() => {
    if (typeof themeOptions === "function") {
      const base = createAppTheme();
      return createAppTheme(themeOptions(base));
    }
    return createAppTheme(themeOptions);
  }, [themeOptions]);
  return /* @__PURE__ */ jsxRuntime.jsxs(styles.ThemeProvider, { theme, children: [
    /* @__PURE__ */ jsxRuntime.jsx(material.CssBaseline, {}),
    /* @__PURE__ */ jsxRuntime.jsx(
      material.GlobalStyles,
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
}) => /* @__PURE__ */ jsxRuntime.jsx(
  Button__default.default,
  {
    variant: "contained",
    color: "primary",
    disableElevation: true,
    disabled: disabled || loading,
    ...rest,
    children: /* @__PURE__ */ jsxRuntime.jsxs(Stack__default.default, { direction: "row", spacing: 1, alignItems: "center", children: [
      loading && /* @__PURE__ */ jsxRuntime.jsx(CircularProgress__default.default, { size: 16, color: "inherit" }),
      !loading && icon,
      /* @__PURE__ */ jsxRuntime.jsx("span", { children })
    ] })
  }
);

exports.AppThemeProvider = AppThemeProvider;
exports.PrimaryButton = PrimaryButton;
exports.createAppTheme = createAppTheme;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map