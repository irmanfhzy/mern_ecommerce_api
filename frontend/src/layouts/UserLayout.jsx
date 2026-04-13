import { Outlet } from "react-router-dom";
import UserNavbar from "../components/user/UserNavbar";
import Footer from "../components/common/Footer";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4  bg-amber-600 h-20">
        <UserNavbar />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
