import { useEffect, useState } from "react";
import { AppSettingContext } from "../contexts/AppSettingContext";
import {
  getAppSetting as getAppSettingApi,
  saveAppSetting as saveAppSettingApi,
} from "../services/appSetting.service";

export default function AppSettingProvider({ children }) {
  const [appSetting, setAppSetting] = useState(null);

  const fetchAppSetting = async () => {
    const res = await getAppSettingApi();
    setAppSetting(res.data.data);
  };

  const saveAppSetting = async (formData) => {
    const res = await saveAppSettingApi(formData);
    setAppSetting(res.data.data);
  };

  useEffect(() => {
    fetchAppSetting();
  }, []);

  return (
    <AppSettingContext.Provider
      value={{
        appSetting,
        fetchAppSetting,
        saveAppSetting,
      }}
    >
      {children}
    </AppSettingContext.Provider>
  );
}
