import AdminMenu from "./AdminMenu";
import NAV_ITEMS from "../../constants/navItems";

export default function AdminNavbar({ open, onClick, className = "" }) {
  return (
    <aside
      className={`overflow-hidden bg-white transition-all duration-300
        ${open ? "w-64" : "w-0 md:w-20"}
        ${className}
      `}
    >
      <AdminMenu menuItems={NAV_ITEMS.ADMIN} open={open} onClick={onClick} />
    </aside>
  );
}
