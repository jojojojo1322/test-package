'use strict';

var styles = require('@mui/material/styles');
var material = require('@mui/material');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
var Button = require('@mui/material/Button');
var CircularProgress = require('@mui/material/CircularProgress');
var Stack = require('@mui/material/Stack');
var axios = require('axios');
var reactToastify = require('react-toastify');
var zustand = require('zustand');
require('react-toastify/dist/ReactToastify.css');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Button__default = /*#__PURE__*/_interopDefault(Button);
var CircularProgress__default = /*#__PURE__*/_interopDefault(CircularProgress);
var Stack__default = /*#__PURE__*/_interopDefault(Stack);
var axios__default = /*#__PURE__*/_interopDefault(axios);

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
var resolvePromise = (value) => Promise.resolve(value);
var applyAuthHeader = (config, token) => {
  const headers = axios.AxiosHeaders.from(config.headers ?? new axios.AxiosHeaders());
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};
var createApiClient = (options = {}) => {
  let tokenManager = options.tokenManager;
  let isRefreshing = false;
  const failedQueue = [];
  const flushQueue = (error, token) => {
    while (failedQueue.length) {
      const queued = failedQueue.shift();
      if (!queued) {
        continue;
      }
      if (error) {
        queued.reject(error);
      } else {
        queued.resolve(token);
      }
    }
  };
  const instance = axios__default.default.create({
    baseURL: options.baseURL ?? "/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.defaultHeaders
    },
    timeout: 15e3,
    ...options.axiosConfig
  });
  instance.interceptors.request.use(async (config) => {
    if (!tokenManager) {
      return config;
    }
    const token = await resolvePromise(tokenManager.getAccessToken());
    if (token) {
      applyAuthHeader(config, token);
    }
    return config;
  });
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;
      const originalRequest = error.config;
      if (!response || !originalRequest || response.status !== 401 || !tokenManager?.refreshToken) {
        if (response?.status === 401) {
          tokenManager?.onUnauthorized?.();
          tokenManager?.clear?.();
        }
        return Promise.reject(error);
      }
      if (originalRequest._retry) {
        tokenManager?.onUnauthorized?.();
        tokenManager?.clear?.();
        return Promise.reject(error);
      }
      if (!isRefreshing) {
        isRefreshing = true;
        tokenManager.refreshToken().then((token) => {
          if (!token) {
            throw new Error("Failed to refresh token: empty payload");
          }
          tokenManager?.setAccessToken?.(token);
          flushQueue(null, token);
        }).catch((refreshError) => {
          flushQueue(refreshError, null);
          tokenManager?.onUnauthorized?.();
          tokenManager?.clear?.();
        }).finally(() => {
          isRefreshing = false;
        });
      }
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (!token) {
              reject(error);
              return;
            }
            applyAuthHeader(originalRequest, token);
            originalRequest._retry = true;
            resolve(instance(originalRequest));
          },
          reject
        });
      });
    }
  );
  const managedInstance = instance;
  managedInstance.setTokenManager = (manager) => {
    tokenManager = manager;
  };
  return managedInstance;
};

// src/api/tokenManager.ts
var createInMemoryTokenManager = (options = {}) => {
  let accessToken = options.accessToken ?? null;
  return {
    getAccessToken: () => accessToken,
    refreshToken: options.refresh ? async () => {
      accessToken = await options.refresh();
      return accessToken;
    } : void 0,
    setAccessToken: (token) => {
      accessToken = token;
    },
    clear: () => {
      accessToken = null;
    },
    onUnauthorized: options.onUnauthorized
  };
};
var randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
var useToastStore = zustand.create((set, get) => ({
  queue: [],
  publish: (payload) => {
    const toast2 = {
      id: payload.id ?? randomId(),
      variant: payload.variant ?? "default",
      title: payload.title,
      message: payload.message,
      options: payload.options
    };
    set((state) => ({ queue: [...state.queue, toast2] }));
    return toast2.id;
  },
  consume: () => {
    const queueSnapshot = get().queue;
    if (queueSnapshot.length === 0) {
      return [];
    }
    set({ queue: [] });
    return queueSnapshot;
  },
  clear: () => set({ queue: [] })
}));
var showToast = (payload) => {
  const { variant, message, title, options, id } = payload;
  const decoratedMessage = title ? `${title}
${message}` : message;
  switch (variant) {
    case "success":
      reactToastify.toast.success(decoratedMessage, { toastId: id, ...options });
      break;
    case "error":
      reactToastify.toast.error(decoratedMessage, { toastId: id, ...options });
      break;
    case "warning":
      reactToastify.toast.warning(decoratedMessage, { toastId: id, ...options });
      break;
    case "info":
      reactToastify.toast.info(decoratedMessage, { toastId: id, ...options });
      break;
    default:
      reactToastify.toast(decoratedMessage, { toastId: id, ...options });
      break;
  }
};
var DEFAULT_CONTAINER_PROPS = {
  position: "bottom-center",
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true
};
var ToastProvider = ({ children, containerProps }) => {
  react.useEffect(() => {
    const unsubscribe = useToastStore.subscribe(
      (state, prevState) => {
        if (state.queue === prevState?.queue) {
          return;
        }
        const messages = useToastStore.getState().consume();
        messages.forEach(showToast);
      }
    );
    return unsubscribe;
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    children,
    /* @__PURE__ */ jsxRuntime.jsx(reactToastify.ToastContainer, { ...DEFAULT_CONTAINER_PROPS, ...containerProps })
  ] });
};
var createPublisher = (variant) => (message, options) => useToastStore.getState().publish({ message, options, variant });
var useToast = () => {
  const publish = useToastStore((state) => state.publish);
  const clear = useToastStore((state) => state.clear);
  const success = react.useCallback(createPublisher("success"), []);
  const error = react.useCallback(createPublisher("error"), []);
  const warning = react.useCallback(createPublisher("warning"), []);
  const info = react.useCallback(createPublisher("info"), []);
  const defaultToast = react.useCallback(createPublisher("default"), []);
  return {
    publish,
    success,
    error,
    warning,
    info,
    toast: defaultToast,
    clear
  };
};
var randomId2 = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
var useModalStore = zustand.create((set) => ({
  current: null,
  open: (payload) => {
    const modalPayload = {
      id: payload.id ?? randomId2(),
      type: payload.type,
      props: payload.props
    };
    set({ current: modalPayload });
    return modalPayload.id;
  },
  close: () => set({ current: null })
}));

// src/configs/eslint.ts
var eslintConfig = {
  root: false,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module",
    ecmaVersion: "latest"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/prop-types": "off"
  },
  ignorePatterns: ["dist", "node_modules"]
};
var eslint_default = eslintConfig;

// src/configs/prettier.ts
var prettierConfig = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf"
};
var prettier_default = prettierConfig;

exports.AppThemeProvider = AppThemeProvider;
exports.PrimaryButton = PrimaryButton;
exports.ToastProvider = ToastProvider;
exports.createApiClient = createApiClient;
exports.createAppTheme = createAppTheme;
exports.createInMemoryTokenManager = createInMemoryTokenManager;
exports.eslintConfig = eslint_default;
exports.prettierConfig = prettier_default;
exports.useModalStore = useModalStore;
exports.useToast = useToast;
exports.useToastStore = useToastStore;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map