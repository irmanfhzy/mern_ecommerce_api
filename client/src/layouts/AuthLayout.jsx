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
      <header className="flex items-center py-4 px-20 h-20 border-b">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-auto h-20 bg-transparent" />
          </Link>

          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      </header>

      <main className="flex flex-1 justify-center items-center p-4 bg-amber-600">
        <Outlet />
      </main>
    </div>
  );
}
