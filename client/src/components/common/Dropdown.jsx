import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  trigger,
  children,
  className = "",
  menuClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleMenuClick() {
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button type="button" onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 ${menuClassName}`}
          onClick={handleMenuClick}
        >
          {children}
        </div>
      )}
    </div>
  );
}
