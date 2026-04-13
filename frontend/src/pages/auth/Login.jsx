import { Link } from "react-router-dom";
import LoginForm from "../../components/common/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center py-4 px-20 h-20">
        <div className="flex w-1/6 gap-8 items-center">
          <Link to="/" className="flex gap-2">
            <img src="" alt="logo" />
            <h1>Commersale</h1>
          </Link>
          <h2 className="font-bold text-2xl">LOGIN</h2>
        </div>
      </header>
      <main className="flex flex-1 justify-center items-center p-4 bg-amber-600">
        <LoginForm />
      </main>
    </div>
  );
}
