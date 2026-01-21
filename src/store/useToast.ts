import { useCallback } from "react";
import type { ToastOptions } from "react-toastify";
import { useToastStore, type ToastVariant } from "./toastStore";

type ToastMethod = (message: string, options?: ToastOptions) => string;

const createPublisher =
  (variant: ToastVariant): ToastMethod =>
  (message, options) =>
    useToastStore.getState().publish({ message, options, variant });

export const useToast = () => {
  const publish = useToastStore((state) => state.publish);
  const clear = useToastStore((state) => state.clear);

  const success = useCallback(createPublisher("success"), []);
  const error = useCallback(createPublisher("error"), []);
  const warning = useCallback(createPublisher("warning"), []);
  const info = useCallback(createPublisher("info"), []);
  const defaultToast = useCallback(createPublisher("default"), []);

  return {
    publish,
    success,
    error,
    warning,
    info,
    toast: defaultToast,
    clear,
  };
};
