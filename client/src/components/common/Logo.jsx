import { useContext } from "react";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function Logo({ className = "" }) {
  const { appSetting } = useContext(AppSettingContext);

  return (
    <>
      {appSetting?.logo?.url && (
        <img
          src={appSetting.logo.url}
          alt={appSetting.appName}
          className={className}
        />
      )}
    </>
  );
}
