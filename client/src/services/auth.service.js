import api from "./api";

export const register = async (data) => {
  return await api.post("/auth/register", data);
};

export const verifyEmail = async (data) => {
  return await api.post("/auth/verify-email", data);
};

export const resendVerificationEmail = async (email) => {
  return await api.post("/auth/resend-verification", { email });
};

export const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", { email });
};

export const verifyResetPassword = async (data) => {
  return await api.post("/auth/verify-reset-password", data);
};

export const resetPassword = async (data) => {
  return await api.post("/auth/reset-password", data);
};

export const resendPasswordReset = async (email) => {
  return await api.post("/auth/resend-password-reset", { email });
};

export const login = async (data) => {
  return await api.post("/auth/login", data);
};

export const googleLogin = async (credential) => {
  return await api.post("/auth/google", { credential });
};

export const getMe = async () => {
  return await api.get("/auth/me");
};

export const logout = async () => {
  return await api.post("/auth/logout");
};
