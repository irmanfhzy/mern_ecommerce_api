import { useEffect, useRef } from "react";

export default function Popover({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = "",
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e) => {
      const clickedPopover = popoverRef.current?.contains(e.target);

      const clickedTrigger = triggerRef.current?.contains(e.target);

      if (clickedPopover || clickedTrigger) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
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
        ${className}
      `}
    >
      {children}
    </div>
  );
}
