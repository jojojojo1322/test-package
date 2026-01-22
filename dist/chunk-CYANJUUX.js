import { useModalStore } from './chunk-UAXL5UNX.js';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useCallback } from 'react';

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
  return /* @__PURE__ */ jsxs(
    Dialog,
    {
      open,
      onClose: handleClose,
      maxWidth,
      fullWidth,
      fullScreen,
      children: [
        title && /* @__PURE__ */ jsxs(
          DialogTitle,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: hideCloseButton ? 3 : 1
            },
            children: [
              /* @__PURE__ */ jsx(Box, { component: "span", children: title }),
              !hideCloseButton && /* @__PURE__ */ jsx(
                IconButton,
                {
                  "aria-label": "close",
                  onClick: onClose,
                  sx: { color: "text.secondary" },
                  children: /* @__PURE__ */ jsx(Box, { component: "span", sx: { fontSize: 20, lineHeight: 1 }, children: "\u2715" })
                }
              )
            ]
          }
        ),
        children && /* @__PURE__ */ jsx(DialogContent, { dividers: true, children }),
        actions && /* @__PURE__ */ jsx(DialogActions, { sx: { px: 3, py: 2 }, children: actions })
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
      return /* @__PURE__ */ jsx(AppModal, { open: true, onClose: close, config: defaultConfig, children: /* @__PURE__ */ jsx(ModalComponent, { onClose: close, ...current.props ?? {} }) });
    }
    const { title, content, actions, config, ...restProps } = current.props ?? {};
    return /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    renderModal()
  ] });
};
var useModal = () => {
  const current = useModalStore((state) => state.current);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);
  const open = useCallback(
    (type, props) => {
      return openModal({ type, props });
    },
    [openModal]
  );
  const close = useCallback(() => {
    closeModal();
  }, [closeModal]);
  return {
    isOpen: current !== null,
    currentModal: current,
    open,
    close
  };
};

export { AppModal, ModalProvider, useModal };
//# sourceMappingURL=chunk-CYANJUUX.js.map
//# sourceMappingURL=chunk-CYANJUUX.js.map