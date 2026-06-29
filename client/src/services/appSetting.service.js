import api from "./api";

export const getAppSetting = () => {
  return api.get("/app-setting");
};

export const saveAppSetting = (formData) => {
  return api.put("/app-setting", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
