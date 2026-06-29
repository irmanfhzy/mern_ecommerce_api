export default function Sidebar({ children }) {
  return (
    <aside className="flex h-full w-2/12 bg-amber-700 min-h-screen p-4">
      {children}
    </aside>
  );
}
