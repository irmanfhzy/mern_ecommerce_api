import * as userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const searchUsersController = asyncHandler(async (req, res) => {
  const data = await userService.searchUsers(req.query.name);
  res.json({ success: true, data });
});

export const getProfileController = asyncHandler(async (req, res) => {
  const data = await userService.getProfile(req.user.userId);
  res.json({ success: true, data });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const data = await userService.updateProfile(
    req.user.userId,
    req.body,
    req.file,
  );
  res.status(200).json({ success: true, data });
});

export const updateProfilePictureController = asyncHandler(async (req, res) => {
  const data = await userService.updateProfilePicture(
    req.user.userId,
    req.file,
  );
  res.status(200).json({ success: true, data });
});

export const updateEmailController = asyncHandler(async (req, res) => {
  const data = await userService.updateEmail(req.user.userId, req.body.email);
  res.status(200).json({ success: true, data });
});

export const updateUsernameController = asyncHandler(async (req, res) => {
  const data = await userService.updateUsername(
    req.user.userId,
    req.body.username,
  );
  res.status(200).json({ success: true, data });
});

export const updatePhoneController = asyncHandler(async (req, res) => {
  const data = await userService.updatePhone(req.user.userId, req.body.phone);
  res.status(200).json({ success: true, data });
});

export const addAddressController = asyncHandler(async (req, res) => {
  const data = await userService.addAddress(req.user.userId, req.body);
  res.status(200).json({ success: true, data });
});

export const updateAddressController = asyncHandler(async (req, res) => {
  const data = await userService.updateAddress(
    req.user.userId,
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, data });
});

export const deleteAddressController = asyncHandler(async (req, res) => {
  const data = await userService.deleteAddress(req.user.userId, req.params.id);
  res.status(200).json({ success: true, data });
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const data = await userService.changePassword(req.user.userId, req.body);
  res.status(200).json({ success: true, data });
});

export const deleteUserController = asyncHandler(async (req, res) => {
  const data = await userService.deleteUserById(req.user.userId);
  res.status(200).json({ success: true, data });
});
