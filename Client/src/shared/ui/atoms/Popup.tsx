import { useEffect, type ReactNode } from 'react';

interface IPopup {
  isOpen: boolean;
  onClose: () => void;
  showTime?: number;
  children?: ReactNode;
}

export const Popup = ({ isOpen, onClose, showTime = 3, children }: IPopup) => {
  useEffect(() => {
    if (!isOpen || !showTime) return;

    const showPopupTimer = setTimeout(() => {
      onClose();
    }, 1000 * showTime);

    return () => {
      clearTimeout(showPopupTimer);
    };
  }, [isOpen, showTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-page-heading/40 p-4">
      <div
        aria-live="polite"
        className="w-full max-w-md rounded-2xl border border-page-border bg-white p-6 shadow-2xl"
        role="status"
      >
        {children}
      </div>
    </div>
  );
};
