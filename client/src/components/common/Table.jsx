export default function Table({
  children,
  className = "",
  containerClassName = "",
}) {
  return (
    <div className={`overflow-x-auto ${containerClassName}`}>
      <table className={`min-w-full border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
}
