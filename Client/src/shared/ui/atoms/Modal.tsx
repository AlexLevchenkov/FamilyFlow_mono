import { useEffect, type ReactNode } from 'react';

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal = ({ isOpen, children, onClose }: IModal) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-page-heading/40 p-4"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <div
        aria-modal="true"
        className="relative w-full max-w-lg rounded-2xl border border-page-border bg-white p-6 shadow-2xl"
        role="dialog"
      >
        <button
          aria-label="Закрити"
          className="absolute top-3 right-3 rounded-lg px-3 py-2 text-sm font-bold text-page-muted hover:bg-page-surface"
          onClick={onClose}
          type="button"
        >
          Закрити
        </button>
        {children}
      </div>
    </div>
  );
};
