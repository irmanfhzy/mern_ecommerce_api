export default function ProductGrid({ children }) {
  return (
    <div
      className="
        mx-auto
        grid
        w-full
        max-w-7xl
        grid-cols-2
        gap-4
        px-4
        py-6
        sm:gap-5
        sm:px-6
        md:grid-cols-3
        lg:grid-cols-4
        lg:px-8
        xl:grid-cols-5
      "
    >
      {children}
    </div>
  );
}
