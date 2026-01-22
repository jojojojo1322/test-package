'use strict';

var Dialog = require('@mui/material/Dialog');
var DialogTitle = require('@mui/material/DialogTitle');
var DialogContent = require('@mui/material/DialogContent');
var DialogActions = require('@mui/material/DialogActions');
var IconButton = require('@mui/material/IconButton');
var Box = require('@mui/material/Box');
var jsxRuntime = require('react/jsx-runtime');
var zustand = require('zustand');
var react = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Dialog__default = /*#__PURE__*/_interopDefault(Dialog);
var DialogTitle__default = /*#__PURE__*/_interopDefault(DialogTitle);
var DialogContent__default = /*#__PURE__*/_interopDefault(DialogContent);
var DialogActions__default = /*#__PURE__*/_interopDefault(DialogActions);
var IconButton__default = /*#__PURE__*/_interopDefault(IconButton);
var Box__default = /*#__PURE__*/_interopDefault(Box);

// src/modal/AppModal.tsx
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
var randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
var useModalStore = zustand.create((set) => ({
  current: null,
  open: (payload) => {
    const modalPayload = {
      id: payload.id ?? randomId(),
      type: payload.type,
      props: payload.props
    };
    set({ current: modalPayload });
    return modalPayload.id;
  },
  close: () => set({ current: null })
}));
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

exports.AppModal = AppModal;
exports.ModalProvider = ModalProvider;
exports.useModal = useModal;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map