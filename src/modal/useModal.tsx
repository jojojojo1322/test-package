import { useCallback } from "react";
import { useModalStore } from "../store/modalStore";

export interface UseModalReturn {
  isOpen: boolean;
  currentModal: ReturnType<typeof useModalStore.getState>["current"];
  open: <T extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    props?: T
  ) => string;
  close: () => void;
}

export const useModal = (): UseModalReturn => {
  const current = useModalStore((state) => state.current);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);

  const open = useCallback(
    <T extends Record<string, unknown> = Record<string, unknown>>(
      type: string,
      props?: T
    ) => {
      return openModal({ type, props: props as Record<string, unknown> });
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
    close,
  };
};
