import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import { PiShoppingCartSimple } from "react-icons/pi";
import SearchBar from "../common/SearchBar";

export default function UserHeader() {
  return (
    <nav className="flex text-white gap-4 w-full h-full items-center">
      <div className="flex gap-4">
        <Link to="/">
          <Logo />
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 px-6 py-1 h-full">
        <SearchBar />
      </div>
      <div className="flex gap-6">
        <Link to="/cart">
          <PiShoppingCartSimple className="w-8 h-8" />
        </Link>
        <div>
          <Link>Login</Link> | <Link>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
