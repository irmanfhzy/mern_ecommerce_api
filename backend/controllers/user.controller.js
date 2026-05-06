import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfileController = asyncHandler(async (req, res) => {
  const data = await userService.getProfile(req.user.userId);
  res.json({ success: true, data });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const data = await userService.updateProfile(req.user.userId, req.body);
  res.status(200).json({ success: true, data });
});

export const updateAccountController = asyncHandler(async (req, res) => {
  const data = await userService.updateAccount(req.user.userId, req.body);
  res.status(200).json({ success: true, data });
});

export const addAddressController = asyncHandler(async (req, res) => {
  const data = await userService.addAddress(req.user.userId, req.body);
  res.status(200).json({ success: true, data });
});

export const updateAddressController = asyncHandler(async (req, res) => {
  const data = await userService.updateAddressAddress(
    req.user.userId,
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, data });
});

export const deleteAddressController = asyncHandler(async (req, res) => {
  const data = await userService.deleteAddressAddress(
    req.user.userId,
    req.params.id,
  );
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
