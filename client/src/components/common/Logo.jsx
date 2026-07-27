import { useContext } from "react";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function Logo({ className = "" }) {
  const { appSetting } = useContext(AppSettingContext);

  if (!appSetting?.logo?.url) {
    return <span>Logo</span>;
  }

  return (
    <img
      src={appSetting.logo.url}
      alt={appSetting.appName}
      className={className}
    />
  );
}
