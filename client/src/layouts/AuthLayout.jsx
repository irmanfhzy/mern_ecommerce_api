import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "../components/common/Logo";

export default function AuthLayout() {
  const location = useLocation();

  const titles = {
    "/login": "LOGIN",
    "/register": "REGISTER",
  };

  const title = titles[location.pathname] || "AUTH";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative flex items-center py-4 px-20 h-20 border-b">
        <div className="flex items-center">
          <Link to="/" className="hidden md:flex items-center gap-2">
            <Logo className="w-auto h-20 bg-transparent" />
          </Link>
        </div>

        <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
          {title}
        </h2>
      </header>

      <main className="flex flex-1 justify-center items-center p-4 bg-green-600">
        <Outlet />
      </main>
    </div>
  );
}
