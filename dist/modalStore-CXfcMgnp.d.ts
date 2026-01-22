import * as zustand from 'zustand';

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

export { type ModalStoreState as M, type ModalPayload as a, useModalStore as u };
