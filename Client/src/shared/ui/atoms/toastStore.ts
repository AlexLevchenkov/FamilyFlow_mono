export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  msg: string;
  type: ToastType;
  duration?: number;
}

let toasts: ToastItem[] = [];
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const toastStore = {
  addToast(msg: string, type: ToastType, duration = 4500): string {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: ToastItem = { id, msg, type, duration };
    toasts = [...toasts, newToast];
    emitChange();
    return id;
  },

  removeToast(id: string) {
    toasts = toasts.filter(t => t.id !== id);
    emitChange();
  },

  clear() {
    toasts = [];
    emitChange();
  },

  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  getSnapshot(): ToastItem[] {
    return toasts;
  },
};

export const toast = {
  success: (msg: string, duration?: number) => toastStore.addToast(msg, 'success', duration),
  error: (msg: string, duration?: number) => toastStore.addToast(msg, 'error', duration),
  info: (msg: string, duration?: number) => toastStore.addToast(msg, 'info', duration),
  dismiss: (id: string) => toastStore.removeToast(id),
  clear: () => toastStore.clear(),
};
