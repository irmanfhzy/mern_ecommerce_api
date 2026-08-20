import { Outlet } from "react-router-dom";

import UserHeader from "../components/user/UserHeader";
import Footer from "../components/common/Footer";

export default function UserLayout() {
  return (
    <>
      <div className="min-h-screen">
        <UserHeader />

        <main className="px-4 py-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
