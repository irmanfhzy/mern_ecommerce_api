import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  register as registerApi,
  login as loginApi,
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
    return res.data.data;
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
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        if (token && token !== "undefined") {
          await getMe();
        }
      } catch (error) {
        alert(error.response?.data?.message || error.message);
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
        setUser,
        loading,
        register,
        login,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
