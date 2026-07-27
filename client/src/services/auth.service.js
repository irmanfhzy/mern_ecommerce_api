import api from "./api";

export const register = async (data) => {
  return await api.post("/auth/register", data);
};

export const login = async (data) => {
  return await api.post("/auth/login", data);
};

export const getMe = async () => {
  return await api.get("/auth/me");
};

export const logout = async () => {
  return await api.post("/auth/logout");
};
