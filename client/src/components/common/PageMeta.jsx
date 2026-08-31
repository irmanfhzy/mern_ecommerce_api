import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function PageMeta() {
  const { appSetting } = useContext(AppSettingContext);
  const location = useLocation();

  useEffect(() => {
    const appName = appSetting?.appName || "CommerSale";

    let title = appName;

    if (location.pathname === "/") {
      title = appName;
    } else if (location.pathname === "/about") {
      title = `About | ${appName}`;
    } else if (location.pathname.startsWith("/product/")) {
      title = `Product | ${appName}`;
    } else if (location.pathname === "/cart") {
      title = `Cart | ${appName}`;
    } else if (location.pathname === "/checkout") {
      title = `Checkout | ${appName}`;
    } else if (location.pathname === "/my-orders") {
      title = `My Orders | ${appName}`;
    } else if (location.pathname.startsWith("/admin")) {
      title = `Admin | ${appName}`;
    }

    document.title = title;

    if (appSetting?.favicon?.url) {
      let link = document.querySelector("link[rel='icon']");

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = appSetting.favicon.url;
    }
  }, [location.pathname, appSetting]);

  return null;
}
