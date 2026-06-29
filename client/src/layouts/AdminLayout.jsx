import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import AdminMenu from "../components/admin/AdminMenu";

export default function AdminLayout() {
  return (
    <div className="flex gap-5 min-h-screen">
      <Sidebar>
        <AdminMenu />
      </Sidebar>
      <Outlet />
    </div>
  );
}
