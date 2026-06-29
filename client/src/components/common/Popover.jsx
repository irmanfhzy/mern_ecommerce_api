import { useEffect, useRef } from "react";

export default function Popover({ isOpen, onClose, children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`
        absolute
        top-full
        left-0
        mt-2
        min-w-72
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-xl
        p-4
        z-50
        animate-in
        fade-in
        zoom-in-95
        duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
