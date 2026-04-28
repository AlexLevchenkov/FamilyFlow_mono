import { createPortal } from "react-dom";
import { useState } from "react";

let setToastFn: (msg: string, type: "success" | "error" | "info") => void;

export const ToastContainer = () => {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  // eslint-disable-next-line react-hooks/globals
  setToastFn = (msg, type) => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  return createPortal(
    toast ? (
      <div
        className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${
          toast.type === "error" ? "bg-red-600 text-white" :
          toast.type === "success" ? "bg-green-600 text-white" :
          "bg-gray-800 text-white"
        }`}
      >
        {toast.msg}
      </div>
    ) : null,
    document.body
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const toast = {
  success: (msg: string) => setToastFn(msg, "success"),
  error: (msg: string) => setToastFn(msg, "error"),
  info: (msg: string) => setToastFn(msg, "info"),
};
