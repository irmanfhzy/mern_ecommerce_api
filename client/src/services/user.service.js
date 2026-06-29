import api from "./api";

export const searchUsers = (params = {}) => {
  return api.get("/users/admin/search", {
    params,
  });
};

export const getProfile = () => {
  return api.get("/users/profile");
};

export const updateProfile = (data) => {
  return api.patch("/users/profile", data);
};

export const updateEmail = (data) => {
  return api.patch("/users/account/email", data);
};

export const updateUsername = (data) => {
  return api.patch("/users/account/username", data);
};

export const updatePhone = (data) => {
  return api.patch("/users/account/phone", data);
};

export const addAddress = (data) => {
  return api.post("/users/profile/addresses", data);
};

export const updateAddress = (addressId, data) => {
  return api.put(`/users/profile/addresses/${addressId}`, data);
};

export const deleteAddress = (addressId) => {
  return api.delete(`/users/profile/addresses/${addressId}`);
};

export const changePassword = (data) => {
  return api.patch("/users/profile/password", data);
};

export const deleteUserById = (userId) => {
  return api.delete(`/users/profile/${userId}`);
};
