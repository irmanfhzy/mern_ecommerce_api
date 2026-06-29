import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../common/Logo";
import { PiShoppingCartSimple } from "react-icons/pi";
import SearchBar from "../common/SearchBar";
import { SearchContext } from "../../contexts/SearchContext";
import { AuthContext } from "../../contexts/AuthContext";
import ProfilePhoto from "../common/ProfilePhoto";
import getImageUrl from "../../utils/getImageUrl";
import DefaultAvatar from "../../assets/default-avatar.png";
import Logout from "../auth/Logout";
import Dropdown from "../common/Dropdown";

export default function UserNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { setKeyword } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const pageTitles = {
    "/about": "ABOUT",
    "/cart": "SHOPPING CART",
  };

  const profilePhotoUrl = getImageUrl(user?.profilePhoto, {
    fallback: DefaultAvatar,
    width: 40,
    height: 40,
  });

  const userMenus = [
    {
      menu: "Profile",
      path: "/profile",
    },
    {
      menu: "Orders",
      path: "/orders",
    },
  ];

  const currentPageTitle = pageTitles[location.pathname] || "";

  return (
    <nav className="grid grid-cols-[1fr_2fr_1fr] items-center h-full text-white gap-6">
      <div className="flex items-center gap-4">
        <Link to="/" onClick={() => setKeyword("")}>
          <Logo />
        </Link>

        <ul className="flex gap-4">
          <li>
            <Link to="/" onClick={() => setKeyword("")}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>

      <div className="flex justify-center h-8">
        {isHomePage ? (
          <SearchBar />
        ) : (
          <h1 className="text-xl font-semibold">{currentPageTitle}</h1>
        )}
      </div>

      <div className="flex justify-end items-center gap-6">
        <Link to="/cart">
          <PiShoppingCartSimple className="w-8 h-8" />
        </Link>

        <div>
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="hover:cursor-pointer"
              >
                <ProfilePhoto src={profilePhotoUrl} alt={user.name} />
              </button>

              {isDropdownOpen && (
                <div className="absolute flex flex-col gap-1 right-0 top-full mt-2 bg-white text-black rounded shadow-md min-w-40 text-center z-9999">
                  <Dropdown lists={userMenus} className="py-1" />
                  <Logout className="py-1" />
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>

              {" | "}

              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
