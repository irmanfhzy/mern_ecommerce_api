import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import Header from "../common/Header";
import Logo from "../common/Logo";
import AppName from "../common/AppName";
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

  return (
    <Header className="grid grid-cols-[1fr_2fr_1fr] items-center h-full gap-6 sticky top-0 z-50 p-4 text-white bg-amber-600">
      <Header.Left className="flex items-center gap-4">
        <Link
          to={PATHS.PUBLIC.HOME}
          onClick={() => setKeyword("")}
          className="flex items-center gap-2"
        >
          <Logo className="w-10 h-10" />
          <AppName />
        </Link>

        <NavMenu
          menuItems={NAV_ITEMS.PUBLIC}
          className="flex items-center gap-4"
        />
      </Header.Left>

      <Header.Center className="flex justify-center h-8">
        {location.pathname === PATHS.PUBLIC.HOME ? (
          <SearchBar
            onSearch={(keyword) => setKeyword(keyword)}
            placeholder="Search products..."
          />
        ) : (
          <h1 className="text-xl font-semibold">
            {PAGE_TITLES[location.pathname] ?? ""}
          </h1>
        )}
      </Header.Center>

      <Header.Right className="flex items-center justify-end gap-6">
        <CartButton />

        {user ? (
          <Dropdown
            trigger={<ProfilePicture src={user.image?.url} alt={user.name} />}
            menuClassName="flex min-w-40 flex-col gap-1 rounded bg-white text-black shadow-md"
          >
            <MenuItems
              menuItems={NAV_ITEMS.USER_PROFILE}
              className="py-1 px-3 hover:bg-gray-300"
            />

            <Separator />

            {user.role === ROLE.ADMIN && (
              <MenuItems
                menuItems={[
                  NAV_ITEMS.ADMIN.find(
                    (item) => item.path === PATHS.ADMIN.DASHBOARD,
                  ),
                ]}
                className="py-1 px-3 hover:bg-gray-300"
              />
            )}

            <Logout icon={true} className="py-1 px-3 hover:bg-gray-300" />
          </Dropdown>
        ) : (
          <>
            <Link to={PATHS.PUBLIC.LOGIN}>Login</Link>
            <span>|</span>
            <Link to={PATHS.PUBLIC.REGISTER}>Register</Link>
          </>
        )}
      </Header.Right>
    </Header>
  );
}
