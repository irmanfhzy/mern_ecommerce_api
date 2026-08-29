import { useContext } from "react";

import { Link, useLocation, matchPath } from "react-router-dom";

import Header from "../common/Header";
import Logo from "../common/Logo";
import MenuItems from "../common/MenuItems";
import SearchBar from "../common/SearchBar";
import CartButton from "./CartButton";
import ProfilePicture from "../common/ProfilePicture";
import Logout from "../auth/Logout";
import Dropdown from "../common/Dropdown";
import NavMenu from "../common/NavMenu";
import Separator from "../common/Separator";

import PATHS from "../../constants/paths";
import NAV_ITEMS from "../../constants/navItems";
import PAGE_TITLES from "../../constants/pageTitles";

import { ROLE } from "@ecommerce/shared/constants/index";

import { SearchContext } from "../../contexts/SearchContext";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserHeader() {
  const location = useLocation();

  const { setKeyword } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const isHome = location.pathname === PATHS.PUBLIC.HOME;
  const isProductDetail = matchPath(
    PATHS.PUBLIC.PRODUCT_DETAIL,
    location.pathname,
  );

  const homeItem = NAV_ITEMS.PUBLIC.find(
    (item) => item.path === PATHS.PUBLIC.HOME,
  );

  const HomeIcon = homeItem?.icon;

  return (
    <Header
      className={`sticky top-0 z-50 grid h-25 items-center gap-6 bg-amber-600 px-6 py-1 text-white ${isHome ? "grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto]" : "grid-cols-[auto_1fr_auto]"}`}
    >
      {/* LEFT */}
      <Header.Left
        className={`items-center ${isHome ? "hidden md:flex" : "flex"}`}
      >
        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to={PATHS.PUBLIC.HOME}
            onClick={() => setKeyword("")}
            className="flex items-center gap-4"
          >
            <Logo className="h-20 w-auto bg-transparent" />
          </Link>

          <NavMenu
            menuItems={NAV_ITEMS.PUBLIC}
            className="flex items-center gap-4"
          />
        </div>

        {/* Mobile + Tablet */}
        <Link
          to={PATHS.PUBLIC.HOME}
          onClick={() => setKeyword("")}
          aria-label="Home"
          className="flex items-center justify-center md:hidden"
        >
          {HomeIcon && <HomeIcon size={22} />}
        </Link>
      </Header.Left>

      {/* CENTER */}
      <Header.Center className="flex h-8 justify-center">
        {isHome ? (
          <SearchBar
            onSearch={(keyword) => setKeyword(keyword)}
            placeholder="Search products..."
          />
        ) : (
          <h1 className="text-xl font-semibold">
            {isProductDetail
              ? "Product Detail"
              : (PAGE_TITLES[location.pathname] ?? "")}
          </h1>
        )}
      </Header.Center>

      {/* RIGHT */}
      <Header.Right className="flex items-center justify-end gap-4 md:gap-6">
        <CartButton />

        {user ? (
          <Dropdown
            trigger={<ProfilePicture src={user.image?.url} alt={user.name} />}
            menuClassName="flex min-w-40 flex-col gap-1 rounded bg-white text-black shadow-md"
          >
            <MenuItems
              menuItems={NAV_ITEMS.USER_PROFILE}
              className="px-3 py-1 hover:bg-gray-300"
            />

            <Separator />

            {user.role === ROLE.ADMIN && (
              <MenuItems
                menuItems={[
                  NAV_ITEMS.ADMIN.find(
                    (item) => item.path === PATHS.ADMIN.DASHBOARD,
                  ),
                ]}
                className="px-3 py-1 hover:bg-gray-300"
              />
            )}

            <Logout icon={true} className="px-3 py-1 hover:bg-gray-300" />
          </Dropdown>
        ) : (
          <>
            {/* Mobile + Tablet */}
            <Link
              to={PATHS.PUBLIC.LOGIN}
              className="flex items-center justify-center md:hidden"
              aria-label="Login"
            >
              <ProfilePicture alt="Login" />
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-2 md:flex">
              <Link to={PATHS.PUBLIC.LOGIN}>Login</Link>

              <span>|</span>

              <Link to={PATHS.PUBLIC.REGISTER}>Register</Link>
            </div>
          </>
        )}
      </Header.Right>
    </Header>
  );
}
