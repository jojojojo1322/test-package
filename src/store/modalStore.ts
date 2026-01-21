import { create } from "zustand";

export interface ModalPayload<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: string;
  props?: T;
}

export interface ModalStoreState<T extends Record<string, unknown> = Record<string, unknown>> {
  current: ModalPayload<T> | null;
  open: (payload: Omit<ModalPayload<T>, "id"> & { id?: string }) => string;
  close: () => void;
}

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const useModalStore = create<ModalStoreState>((set) => ({
  current: null,
  open: (payload) => {
    const modalPayload: ModalPayload = {
      id: payload.id ?? randomId(),
      type: payload.type,
      props: payload.props,
    };
    set({ current: modalPayload });
    return modalPayload.id;
  },
  close: () => set({ current: null }),
}));
