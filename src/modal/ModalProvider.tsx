import type { PropsWithChildren, ReactNode, ComponentType } from "react";
import { useModalStore } from "../store/modalStore";
import { AppModal, type ModalConfig } from "./AppModal";

export type ModalRegistry = Record<
  string,
  ComponentType<{ onClose: () => void; [key: string]: unknown }>
>;

export interface ModalProviderProps {
  registry?: ModalRegistry;
  defaultConfig?: ModalConfig;
}

export const ModalProvider = ({
  children,
  registry = {},
  defaultConfig,
}: PropsWithChildren<ModalProviderProps>) => {
  const current = useModalStore((state) => state.current);
  const close = useModalStore((state) => state.close);

  const renderModal = (): ReactNode => {
    if (!current) return null;

    const ModalComponent = registry[current.type];

    if (ModalComponent) {
      return (
        <AppModal open onClose={close} config={defaultConfig}>
          <ModalComponent onClose={close} {...(current.props ?? {})} />
        </AppModal>
      );
    }

    // fallback: props에서 title, content, actions를 직접 가져옴
    const { title, content, actions, config, ...restProps } = (current.props ?? {}) as {
      title?: ReactNode;
      content?: ReactNode;
      actions?: ReactNode;
      config?: ModalConfig;
      [key: string]: unknown;
    };

    return (
      <AppModal
        open
        onClose={close}
        title={title}
        actions={actions}
        config={{ ...defaultConfig, ...config }}
        {...restProps}
      >
        {content}
      </AppModal>
    );
  };

  return (
    <>
      {children}
      {renderModal()}
    </>
  );
};
