import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  id = "password",
  name = "password",
  placeholder,
  value,
  onChange,
  fieldClassName,
  toggleClassName,
  required = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full ${fieldClassName}`}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${toggleClassName}`}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
