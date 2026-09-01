import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import Header from "../common/Header";
import Logo from "../common/Logo";
import AppName from "../common/AppName";
import Dropdown from "../common/Dropdown";
import ProfilePicture from "../common/ProfilePicture";
import Logout from "../auth/Logout";
import Button from "../common/Button";
import MenuItems from "../common/MenuItems";

import PATHS from "../../constants/paths";
import NAV_ITEMS from "../../constants/navItems";
import { AuthContext } from "../../contexts/AuthContext";
import PAGE_TITLES from "../../constants/pageTitles";

export default function AdminHeader({ onToggleSidebar }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Header className="h-25 grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-1 text-white bg-green-600 shrink-0">
      <Header.Left className="flex items-center gap-4">
        <Button
          variant="transparent"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-8 h-8" />
        </Button>

        <Link
          to={PATHS.ADMIN.DASHBOARD}
          className="hidden md:flex items-center gap-2"
        >
          <Logo className="w-auto h-20 bg-transparent" />
        </Link>
      </Header.Left>

      <Header.Center className="flex justify-center">
        <h1 className="text-xl font-semibold">
          {PAGE_TITLES[location.pathname] ?? ""}
        </h1>
      </Header.Center>

      <Header.Right className="flex justify-end items-center">
        <Dropdown
          trigger={<ProfilePicture src={user?.image?.url} alt={user?.name} />}
          menuClassName="flex min-w-40 flex-col gap-1 rounded bg-white text-black shadow-md"
        >
          <MenuItems
            menuItems={NAV_ITEMS.ADMIN_PROFILE}
            className="py-1 px-3 hover:bg-gray-300"
          />

          <Logout icon={true} className="py-1 px-3 hover:bg-gray-300" />
        </Dropdown>
      </Header.Right>
    </Header>
  );
}
