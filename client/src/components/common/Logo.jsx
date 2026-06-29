import { useContext } from "react";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function Logo() {
  const { appSetting } = useContext(AppSettingContext);
  return (
    <div className="flex gap-2">
      <div>{appSetting?.logo.url || "Logo"}</div>
      <div>{appSetting?.appName || "CommerSale"}</div>
    </div>
  );
}
