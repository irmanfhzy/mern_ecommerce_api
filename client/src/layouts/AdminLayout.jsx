import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminHeader from "../components/admin/AdminHeader";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <main className="flex flex-1 gap-5 overflow-hidden p-4">
        <AdminNavbar open={isSidebarOpen} onClick={handleCloseSideBar} />

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
