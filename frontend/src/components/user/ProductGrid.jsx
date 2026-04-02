export default function ProductGrid({ children }) {
  return (
    <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
      {children}
    </div>
  );
}
