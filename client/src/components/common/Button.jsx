const baseStyle =
  "inline-flex items-center justify-center font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  success: "bg-green-600 text-white hover:bg-green-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-700 text-gray-700 hover:bg-gray-200",
  ghost: "text-gray-700 hover:bg-gray-100",
  transparent: "p-0 bg-transparent hover:bg-transparent",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  type = "button",
  children,
  ref,
  variant = "",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      ref={ref}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
