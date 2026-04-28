import { useEffect, type ReactNode } from "react";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal = ({ isOpen, children, onClose }: IModal) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="relative w-3xl bg-white p-6 rounded shadow-lg">
        <button className="absolute top-0 right-0 p-3 text-red-800 cursor-pointer float-right" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}