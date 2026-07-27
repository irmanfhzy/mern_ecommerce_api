import AdminMenu from "./AdminMenu";

import NAV_ITEMS from "../../constants/navItems";

export default function AdminNavbar({ open, className = "" }) {
  return (
    <aside
      className={`bg-white transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } ${className}`}
    >
      <AdminMenu menuItems={NAV_ITEMS.ADMIN} open={open} />
    </aside>
  );
}
