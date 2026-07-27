import {
  Home,
  ShoppingBag,
  Store,
  Package,
  User,
  Info,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import PATHS from "./paths";

const NAV_ITEMS = {
  PUBLIC: [
    {
      label: "Home",
      path: PATHS.PUBLIC.HOME,
      icon: Home,
    },
    {
      label: "About",
      path: PATHS.PUBLIC.ABOUT,
      icon: Info,
    },
  ],

  USER_PROFILE: [
    {
      label: "Profile",
      path: PATHS.USER.PROFILE,
      icon: User,
    },
    {
      label: "My Orders",
      path: PATHS.USER.MY_ORDERS,
      icon: Package,
    },
  ],

  ADMIN_PROFILE: [
    {
      label: "Profile",
      path: PATHS.USER.PROFILE,
      icon: User,
    },
    {
      label: "Store",
      path: PATHS.PUBLIC.HOME,
      icon: Store,
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: PATHS.ADMIN.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: PATHS.ADMIN.PRODUCTS,
      icon: ShoppingBag,
    },
    {
      label: "Orders",
      path: PATHS.ADMIN.ORDERS,
      icon: Package,
    },
    {
      label: "Settings",
      path: PATHS.ADMIN.SETTINGS,
      icon: Settings,
    },
  ],
};

export default NAV_ITEMS;
