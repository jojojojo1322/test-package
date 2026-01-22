import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

export interface ModalConfig {
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  fullScreen?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
}

export interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  config?: ModalConfig;
  hideCloseButton?: boolean;
}

export const AppModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  config = {},
  hideCloseButton = false,
}: AppModalProps) => {
  const {
    maxWidth = "sm",
    fullWidth = true,
    fullScreen = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
  } = config;

  const handleClose = (_event: object, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" && disableBackdropClick) return;
    if (reason === "escapeKeyDown" && disableEscapeKeyDown) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
    >
      {title && (
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: hideCloseButton ? 3 : 1,
          }}
        >
          <Box component="span">{title}</Box>
          {!hideCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ color: "text.secondary" }}
            >
              <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
                ✕
              </Box>
            </IconButton>
          )}
        </DialogTitle>
      )}
      {children && <DialogContent dividers>{children}</DialogContent>}
      {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
};
