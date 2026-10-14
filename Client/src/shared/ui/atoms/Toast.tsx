import { createPortal } from 'react-dom';
import { useEffect, useSyncExternalStore } from 'react';
import { toastStore } from './ToastStore';
import type { ToastItem } from './ToastStore';

// eslint-disable-next-line react-refresh/only-export-components
export { toast, toastStore } from './ToastStore';
export type { ToastItem, ToastType } from './ToastStore';

interface ToastCardProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

const ToastCard = ({ item, onClose }: ToastCardProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(item.id);
    }, item.duration ?? 4500);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, onClose]);

  const typeConfig = {
    success: {
      border: 'border-emerald-200/80',
      shadow: 'shadow-[0_10px_25px_rgba(16,185,129,0.15)]',
      badge: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    error: {
      border: 'border-rose-200/80',
      shadow: 'shadow-[0_10px_25px_rgba(244,63,94,0.15)]',
      badge: 'bg-rose-50 text-rose-600',
      icon: (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    info: {
      border: 'border-indigo-200/80',
      shadow: 'shadow-[0_10px_25px_rgba(99,102,241,0.15)]',
      badge: 'bg-indigo-50 text-indigo-600',
      icon: (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  }[item.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white/95 px-4 py-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 sm:min-w-[320px] max-w-md ${typeConfig.border} ${typeConfig.shadow}`}
    >
      <div className={`grid size-8 shrink-0 place-items-center rounded-xl ${typeConfig.badge}`}>
        {typeConfig.icon}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-[13px] font-semibold leading-relaxed text-slate-800">
          {item.msg}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        aria-label="Закрити сповіщення"
        className="-mr-1.5 -mt-1 grid size-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const activeToasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    () => []
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-9999 flex flex-col gap-2.5 max-sm:left-4 max-sm:right-4 max-sm:bottom-4"
    >
      {activeToasts.map(item => (
        <ToastCard key={item.id} item={item} onClose={toastStore.removeToast} />
      ))}
    </div>,
    document.body
  );
};
