import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { ToastContainerProps, ToastOptions } from 'react-toastify';
import * as zustand from 'zustand';

type ToastProviderProps = PropsWithChildren<{
    containerProps?: ToastContainerProps;
}>;
declare const ToastProvider: ({ children, containerProps }: ToastProviderProps) => react_jsx_runtime.JSX.Element;

type ToastVariant = "default" | "info" | "success" | "warning" | "error";
type ToastPayload = {
    id: string;
    title?: string;
    message: string;
    variant: ToastVariant;
    options?: ToastOptions;
};
type ToastInput = Omit<ToastPayload, "id" | "variant"> & {
    id?: string;
    variant?: ToastVariant;
};
interface ToastStoreState {
    queue: ToastPayload[];
    publish: (payload: ToastInput) => string;
    consume: () => ToastPayload[];
    clear: () => void;
}
declare const useToastStore: zustand.UseBoundStore<zustand.StoreApi<ToastStoreState>>;

type ToastMethod = (message: string, options?: ToastOptions) => string;
declare const useToast: () => {
    publish: (payload: ToastInput) => string;
    success: ToastMethod;
    error: ToastMethod;
    warning: ToastMethod;
    info: ToastMethod;
    toast: ToastMethod;
    clear: () => void;
};

interface ModalPayload<T extends Record<string, unknown> = Record<string, unknown>> {
    id: string;
    type: string;
    props?: T;
}
interface ModalStoreState<T extends Record<string, unknown> = Record<string, unknown>> {
    current: ModalPayload<T> | null;
    open: (payload: Omit<ModalPayload<T>, "id"> & {
        id?: string;
    }) => string;
    close: () => void;
}
declare const useModalStore: zustand.UseBoundStore<zustand.StoreApi<ModalStoreState<Record<string, unknown>>>>;

export { type ModalPayload, type ModalStoreState, type ToastInput, type ToastPayload, ToastProvider, type ToastProviderProps, type ToastStoreState, type ToastVariant, useModalStore, useToast, useToastStore };
