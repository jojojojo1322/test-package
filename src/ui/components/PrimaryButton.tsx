import Button, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

export type PrimaryButtonProps = ButtonProps & {
  loading?: boolean;
  icon?: ReactNode;
};

export const PrimaryButton = ({
  loading = false,
  icon,
  children,
  disabled,
  ...rest
}: PrimaryButtonProps) => (
  <Button
    variant="contained"
    color="primary"
    disableElevation
    disabled={disabled || loading}
    {...rest}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      {loading && <CircularProgress size={16} color="inherit" />}
      {!loading && icon}
      <span>{children}</span>
    </Stack>
  </Button>
);
