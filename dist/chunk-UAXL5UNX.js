import { create } from 'zustand';

// src/store/modalStore.ts
var randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
var useModalStore = create((set) => ({
  current: null,
  open: (payload) => {
    const modalPayload = {
      id: payload.id ?? randomId(),
      type: payload.type,
      props: payload.props
    };
    set({ current: modalPayload });
    return modalPayload.id;
  },
  close: () => set({ current: null })
}));

export { useModalStore };
//# sourceMappingURL=chunk-UAXL5UNX.js.map
//# sourceMappingURL=chunk-UAXL5UNX.js.map