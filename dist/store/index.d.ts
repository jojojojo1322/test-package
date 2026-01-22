import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { ToastContainerProps, ToastOptions } from 'react-toastify';
import * as zustand from 'zustand';
export { a as ModalPayload, M as ModalStoreState, u as useModalStore } from '../modalStore-CXfcMgnp.js';

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

export { type ToastInput, type ToastPayload, ToastProvider, type ToastProviderProps, type ToastStoreState, type ToastVariant, useToast, useToastStore };
