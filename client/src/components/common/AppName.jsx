import { useContext } from "react";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function AppName({ className = "" }) {
  const { appSetting } = useContext(AppSettingContext);

  return (
    <>
      {appSetting?.appName && (
        <span className={className}>{appSetting.appName}</span>
      )}
    </>
  );
}
