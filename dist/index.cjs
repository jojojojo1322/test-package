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
var Dialog = require('@mui/material/Dialog');
var DialogTitle = require('@mui/material/DialogTitle');
var DialogContent = require('@mui/material/DialogContent');
var DialogActions = require('@mui/material/DialogActions');
var IconButton = require('@mui/material/IconButton');
var Box = require('@mui/material/Box');
var agGridReact = require('ag-grid-react');
var agGridCommunity = require('ag-grid-community');
var agGridEnterprise = require('ag-grid-enterprise');
var FullCalendar = require('@fullcalendar/react');
var dayGridPlugin = require('@fullcalendar/daygrid');
var Timeline = require('react-calendar-timeline');
var dayjs = require('dayjs');
var recharts = require('recharts');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Button__default = /*#__PURE__*/_interopDefault(Button);
var CircularProgress__default = /*#__PURE__*/_interopDefault(CircularProgress);
var Stack__default = /*#__PURE__*/_interopDefault(Stack);
var axios__default = /*#__PURE__*/_interopDefault(axios);
var Dialog__default = /*#__PURE__*/_interopDefault(Dialog);
var DialogTitle__default = /*#__PURE__*/_interopDefault(DialogTitle);
var DialogContent__default = /*#__PURE__*/_interopDefault(DialogContent);
var DialogActions__default = /*#__PURE__*/_interopDefault(DialogActions);
var IconButton__default = /*#__PURE__*/_interopDefault(IconButton);
var Box__default = /*#__PURE__*/_interopDefault(Box);
var FullCalendar__default = /*#__PURE__*/_interopDefault(FullCalendar);
var dayGridPlugin__default = /*#__PURE__*/_interopDefault(dayGridPlugin);
var Timeline__default = /*#__PURE__*/_interopDefault(Timeline);
var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

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
var AppModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  config = {},
  hideCloseButton = false
}) => {
  const {
    maxWidth = "sm",
    fullWidth = true,
    fullScreen = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false
  } = config;
  const handleClose = (_event, reason) => {
    if (reason === "backdropClick" && disableBackdropClick) return;
    if (reason === "escapeKeyDown" && disableEscapeKeyDown) return;
    onClose();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Dialog__default.default,
    {
      open,
      onClose: handleClose,
      maxWidth,
      fullWidth,
      fullScreen,
      children: [
        title && /* @__PURE__ */ jsxRuntime.jsxs(
          DialogTitle__default.default,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: hideCloseButton ? 3 : 1
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(Box__default.default, { component: "span", children: title }),
              !hideCloseButton && /* @__PURE__ */ jsxRuntime.jsx(
                IconButton__default.default,
                {
                  "aria-label": "close",
                  onClick: onClose,
                  sx: { color: "text.secondary" },
                  children: /* @__PURE__ */ jsxRuntime.jsx(Box__default.default, { component: "span", sx: { fontSize: 20, lineHeight: 1 }, children: "\u2715" })
                }
              )
            ]
          }
        ),
        children && /* @__PURE__ */ jsxRuntime.jsx(DialogContent__default.default, { dividers: true, children }),
        actions && /* @__PURE__ */ jsxRuntime.jsx(DialogActions__default.default, { sx: { px: 3, py: 2 }, children: actions })
      ]
    }
  );
};
var ModalProvider = ({
  children,
  registry = {},
  defaultConfig
}) => {
  const current = useModalStore((state) => state.current);
  const close = useModalStore((state) => state.close);
  const renderModal = () => {
    if (!current) return null;
    const ModalComponent = registry[current.type];
    if (ModalComponent) {
      return /* @__PURE__ */ jsxRuntime.jsx(AppModal, { open: true, onClose: close, config: defaultConfig, children: /* @__PURE__ */ jsxRuntime.jsx(ModalComponent, { onClose: close, ...current.props ?? {} }) });
    }
    const { title, content, actions, config, ...restProps } = current.props ?? {};
    return /* @__PURE__ */ jsxRuntime.jsx(
      AppModal,
      {
        open: true,
        onClose: close,
        title,
        actions,
        config: { ...defaultConfig, ...config },
        ...restProps,
        children: content
      }
    );
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    children,
    renderModal()
  ] });
};
var useModal = () => {
  const current = useModalStore((state) => state.current);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);
  const open = react.useCallback(
    (type, props) => {
      return openModal({ type, props });
    },
    [openModal]
  );
  const close = react.useCallback(() => {
    closeModal();
  }, [closeModal]);
  return {
    isOpen: current !== null,
    currentModal: current,
    open,
    close
  };
};
var modulesRegistered = false;
var registerModules = (licenseKey) => {
  if (modulesRegistered) return;
  if (licenseKey) {
    agGridEnterprise.LicenseManager.setLicenseKey(licenseKey);
    agGridCommunity.ModuleRegistry.registerModules([agGridEnterprise.AllEnterpriseModule]);
  } else {
    agGridCommunity.ModuleRegistry.registerModules([agGridCommunity.AllCommunityModule]);
  }
  modulesRegistered = true;
};
function AgGridWrapperInner({
  rowData,
  columnDefs,
  licenseKey,
  height = 400,
  width = "100%",
  className,
  style,
  theme = "quartz",
  darkMode = false,
  onGridApiReady,
  onGridReady,
  defaultColDef,
  ...rest
}, ref) {
  const gridRef = react.useRef(null);
  react.useMemo(() => {
    registerModules(licenseKey);
  }, [licenseKey]);
  react.useImperativeHandle(ref, () => ({
    getApi: () => gridRef.current?.api
  }));
  const mergedDefaultColDef = react.useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
      filter: true,
      ...defaultColDef
    }),
    [defaultColDef]
  );
  const handleGridReady = react.useCallback(
    (event) => {
      onGridApiReady?.(event.api);
      onGridReady?.(event);
    },
    [onGridApiReady, onGridReady]
  );
  const themeClass = darkMode ? `ag-theme-${theme}-dark` : `ag-theme-${theme}`;
  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    ...style
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${themeClass} ${className ?? ""}`, style: containerStyle, children: /* @__PURE__ */ jsxRuntime.jsx(
    agGridReact.AgGridReact,
    {
      ref: gridRef,
      rowData,
      columnDefs,
      defaultColDef: mergedDefaultColDef,
      onGridReady: handleGridReady,
      animateRows: true,
      ...rest
    }
  ) });
}
var AgGridWrapper = react.forwardRef(AgGridWrapperInner);
function CalendarWrapperInner({
  events = [],
  height = "auto",
  style,
  className,
  onEventClick,
  onDateSelect,
  onCalendarApiReady,
  initialView = "dayGridMonth",
  headerToolbar,
  locale = "ko",
  ...rest
}, ref) {
  const calendarRef = react.useRef(null);
  react.useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi()
  }));
  const handleEventClick = react.useCallback(
    (clickInfo) => {
      const event = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start ?? "",
        end: clickInfo.event.end ?? void 0,
        allDay: clickInfo.event.allDay,
        color: clickInfo.event.backgroundColor,
        textColor: clickInfo.event.textColor,
        extendedProps: clickInfo.event.extendedProps
      };
      onEventClick?.(event, clickInfo);
    },
    [onEventClick]
  );
  const handleDateSelect = react.useCallback(
    (selectInfo) => {
      onDateSelect?.(selectInfo);
    },
    [onDateSelect]
  );
  const handleDatesSet = react.useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      onCalendarApiReady?.(api);
    }
  }, [onCalendarApiReady]);
  const defaultHeaderToolbar = headerToolbar ?? {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek,dayGridDay"
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className, style, children: /* @__PURE__ */ jsxRuntime.jsx(
    FullCalendar__default.default,
    {
      ref: calendarRef,
      plugins: [dayGridPlugin__default.default],
      initialView,
      events,
      headerToolbar: defaultHeaderToolbar,
      locale,
      height,
      eventClick: onEventClick ? handleEventClick : void 0,
      select: onDateSelect ? handleDateSelect : void 0,
      selectable: !!onDateSelect,
      datesSet: handleDatesSet,
      ...rest
    }
  ) });
}
var CalendarWrapper = react.forwardRef(CalendarWrapperInner);
var TimelineWrapper = ({
  groups,
  items,
  defaultTimeStart,
  defaultTimeEnd,
  height = 400,
  style,
  className,
  sidebarWidth = 150,
  showHeader = true,
  headerLabel = "\uADF8\uB8F9",
  onItemClick,
  onItemMove,
  onItemResize,
  onCanvasClick
}) => {
  const timeStart = react.useMemo(
    () => defaultTimeStart?.getTime() ?? dayjs__default.default().startOf("day").valueOf(),
    [defaultTimeStart]
  );
  const timeEnd = react.useMemo(
    () => defaultTimeEnd?.getTime() ?? dayjs__default.default().endOf("day").valueOf(),
    [defaultTimeEnd]
  );
  const handleItemClick = react.useCallback(
    (itemId, e, time) => {
      onItemClick?.(itemId, e, time);
    },
    [onItemClick]
  );
  const handleItemMove = react.useCallback(
    (itemId, dragTime, newGroupOrder) => {
      onItemMove?.(itemId, dragTime, newGroupOrder);
    },
    [onItemMove]
  );
  const handleItemResize = react.useCallback(
    (itemId, time, edge) => {
      onItemResize?.(itemId, time, edge);
    },
    [onItemResize]
  );
  const handleCanvasClick = react.useCallback(
    (groupId, time, e) => {
      onCanvasClick?.(groupId, time, e);
    },
    [onCanvasClick]
  );
  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    ...style
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className, style: containerStyle, children: /* @__PURE__ */ jsxRuntime.jsx(
    Timeline__default.default,
    {
      groups,
      items,
      defaultTimeStart: timeStart,
      defaultTimeEnd: timeEnd,
      sidebarWidth,
      onItemClick: onItemClick ? handleItemClick : void 0,
      onItemMove: onItemMove ? handleItemMove : void 0,
      onItemResize: onItemResize ? handleItemResize : void 0,
      onCanvasClick: onCanvasClick ? handleCanvasClick : void 0,
      children: showHeader && /* @__PURE__ */ jsxRuntime.jsxs(Timeline.TimelineHeaders, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.SidebarHeader, { children: ({ getRootProps }) => /* @__PURE__ */ jsxRuntime.jsx("div", { ...getRootProps(), children: headerLabel }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.DateHeader, { unit: "primaryHeader" }),
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.DateHeader, {})
      ] })
    }
  ) });
};
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
exports.AgGridWrapper = AgGridWrapper;
exports.AppModal = AppModal;
exports.AppThemeProvider = AppThemeProvider;
exports.CalendarWrapper = CalendarWrapper;
exports.ChartWrapper = ChartWrapper;
exports.DEFAULT_COLORS = DEFAULT_COLORS;
exports.ModalProvider = ModalProvider;
exports.PrimaryButton = PrimaryButton;
exports.TimelineWrapper = TimelineWrapper;
exports.ToastProvider = ToastProvider;
exports.createApiClient = createApiClient;
exports.createAppTheme = createAppTheme;
exports.createInMemoryTokenManager = createInMemoryTokenManager;
exports.eslintConfig = eslint_default;
exports.prettierConfig = prettier_default;
exports.useModal = useModal;
exports.useModalStore = useModalStore;
exports.useToast = useToast;
exports.useToastStore = useToastStore;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map