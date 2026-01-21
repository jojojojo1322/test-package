import { create } from "zustand";
import type { ToastOptions } from "react-toastify";

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export type ToastVariant = "default" | "info" | "success" | "warning" | "error";

export type ToastPayload = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  options?: ToastOptions;
};

export type ToastInput = Omit<ToastPayload, "id" | "variant"> & {
  id?: string;
  variant?: ToastVariant;
};

export interface ToastStoreState {
  queue: ToastPayload[];
  publish: (payload: ToastInput) => string;
  consume: () => ToastPayload[];
  clear: () => void;
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
  queue: [],
  publish: (payload) => {
    const toast: ToastPayload = {
      id: payload.id ?? randomId(),
      variant: payload.variant ?? "default",
      title: payload.title,
      message: payload.message,
      options: payload.options,
    };

    set((state) => ({ queue: [...state.queue, toast] }));
    return toast.id;
  },
  consume: () => {
    const queueSnapshot = get().queue;
    if (queueSnapshot.length === 0) {
      return [];
    }
    set({ queue: [] });
    return queueSnapshot;
  },
  clear: () => set({ queue: [] }),
}));
