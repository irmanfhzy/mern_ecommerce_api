import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`
    relative
    w-full
    ${sizes[size]}
    max-h-[90vh]
    rounded-2xl
    bg-white
    shadow-2xl
    flex
    flex-col
  `}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            <Button
              onClick={onClose}
              variant="ghost"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto p-5 ${className}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
