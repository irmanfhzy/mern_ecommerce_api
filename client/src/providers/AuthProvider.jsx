import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  register as registerApi,
  login as loginApi,
  refreshToken as refreshTokenApi,
  getMe as getMeApi,
  logout as logoutApi,
} from "../services/auth.service";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (data) => {
    await registerApi(data);
  };

  const login = async (data) => {
    const res = await loginApi(data);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.data);
  };

  const refreshAccessToken = async (refreshToken) => {
    const res = await refreshTokenApi(refreshToken);
    localStorage.setItem("accessToken", res.data.accessToken);
  };

  const getMe = async () => {
    const res = await getMeApi();
    setUser(res.data.data);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token && token !== "undefined") {
          await getMe();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        refreshAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
