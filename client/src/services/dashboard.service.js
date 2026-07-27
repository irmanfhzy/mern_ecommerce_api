import api from "./api";

export const getDashboard = async () => {
  return await api.get("/admin/dashboard");
};
