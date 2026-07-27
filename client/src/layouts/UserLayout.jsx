import { Outlet } from "react-router-dom";

import UserHeader from "../components/user/UserHeader";
import Footer from "../components/common/Footer";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />

      <main className="flex-1 py-4 px-4">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
