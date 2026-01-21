import { PropsWithChildren, useEffect } from "react";
import { toast, ToastContainer, type ToastContainerProps } from "react-toastify";
import { useToastStore, type ToastPayload, type ToastStoreState } from "./toastStore";

import "react-toastify/dist/ReactToastify.css";

const showToast = (payload: ToastPayload) => {
  const { variant, message, title, options, id } = payload;
  const decoratedMessage = title ? `${title}\n${message}` : message;

  switch (variant) {
    case "success":
      toast.success(decoratedMessage, { toastId: id, ...options });
      break;
    case "error":
      toast.error(decoratedMessage, { toastId: id, ...options });
      break;
    case "warning":
      toast.warning(decoratedMessage, { toastId: id, ...options });
      break;
    case "info":
      toast.info(decoratedMessage, { toastId: id, ...options });
      break;
    default:
      toast(decoratedMessage, { toastId: id, ...options });
      break;
  }
};

const DEFAULT_CONTAINER_PROPS: ToastContainerProps = {
  position: "bottom-center",
  newestOnTop: true,
  closeOnClick: true,
  pauseOnHover: true,
};

export type ToastProviderProps = PropsWithChildren<{
  containerProps?: ToastContainerProps;
}>;

export const ToastProvider = ({ children, containerProps }: ToastProviderProps) => {
  useEffect(() => {
    const unsubscribe = useToastStore.subscribe(
      (state: ToastStoreState, prevState?: ToastStoreState) => {
        if (state.queue === prevState?.queue) {
          return;
        }

        const messages = useToastStore.getState().consume();
        messages.forEach(showToast);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <ToastContainer {...DEFAULT_CONTAINER_PROPS} {...containerProps} />
    </>
  );
};
