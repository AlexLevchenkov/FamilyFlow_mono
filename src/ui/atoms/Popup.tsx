import { useEffect, type ReactNode } from "react";

interface IPopup {
  isOpen: boolean;
  onClose: () => void;
  showTime?: number;
  children?: ReactNode;
}

export const Popup = ({isOpen, onClose, showTime = 3, children}: IPopup) => {
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
    <div className="fixed top-0 left-0 right-0 p-10 bg-black/50 flex items-center justify-center">
      {children}
    </div>
  )
}