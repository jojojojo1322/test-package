import * as react_jsx_runtime from 'react/jsx-runtime';
import { DialogProps } from '@mui/material/Dialog';
import { ReactNode, PropsWithChildren, ComponentType } from 'react';
import { u as useModalStore } from '../modalStore-CXfcMgnp.cjs';
import 'zustand';

interface ModalConfig {
    maxWidth?: DialogProps["maxWidth"];
    fullWidth?: boolean;
    fullScreen?: boolean;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
}
interface AppModalProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    children?: ReactNode;
    actions?: ReactNode;
    config?: ModalConfig;
    hideCloseButton?: boolean;
}
declare const AppModal: ({ open, onClose, title, children, actions, config, hideCloseButton, }: AppModalProps) => react_jsx_runtime.JSX.Element;

type ModalRegistry = Record<string, ComponentType<{
    onClose: () => void;
    [key: string]: unknown;
}>>;
interface ModalProviderProps {
    registry?: ModalRegistry;
    defaultConfig?: ModalConfig;
}
declare const ModalProvider: ({ children, registry, defaultConfig, }: PropsWithChildren<ModalProviderProps>) => react_jsx_runtime.JSX.Element;

interface UseModalReturn {
    isOpen: boolean;
    currentModal: ReturnType<typeof useModalStore.getState>["current"];
    open: <T extends Record<string, unknown> = Record<string, unknown>>(type: string, props?: T) => string;
    close: () => void;
}
declare const useModal: () => UseModalReturn;

export { AppModal, type AppModalProps, type ModalConfig, ModalProvider, type ModalProviderProps, type ModalRegistry, type UseModalReturn, useModal };
