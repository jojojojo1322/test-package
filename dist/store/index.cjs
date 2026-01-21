'use strict';

var react = require('react');
var reactToastify = require('react-toastify');
var zustand = require('zustand');
require('react-toastify/dist/ReactToastify.css');
var jsxRuntime = require('react/jsx-runtime');

// src/store/ToastProvider.tsx
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

exports.ToastProvider = ToastProvider;
exports.useModalStore = useModalStore;
exports.useToast = useToast;
exports.useToastStore = useToastStore;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map