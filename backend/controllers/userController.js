import User from "../models/User.js";
import argon2 from "argon2";
import normalizePhone from "../utils/phoneNormalizer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const findUsers = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const users = User.find({ name: { $regex: name, $options: "i" } });
  if (!users || users.length === 0) {
    throw new AppError("Users are not found", 404);
  }
  res.status(200).json({ success: true, data: users });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { name, gender, dateOfBirth, image } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      name,
      gender,
      dateOfBirth,
      image,
    },
    { runValidators: true, returnDocument: "after" },
  );
  if (!user) {
    throw new AppError("User is not found", 404);
  }
  res.status(200).json({ success: true, data: user });
});

export const updateAccount = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const dataUpdated = {};

  if (req.body.email) dataUpdated.email = req.body.email;
  if (req.body.username) dataUpdated.username = req.body.username;
  if (req.body.phone) dataUpdated.phone = normalizePhone(req.body.phone);

  const user = await User.findByIdAndUpdate(userId, dataUpdated, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!user) {
    throw new AppError("User is not found", 404);
  }
  res.status(200).json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new AppError(
      "Current password, new password, and confirm new password are required",
      400,
    );
  }

  if (newPassword.length < 8) {
    throw new AppError("New password must be at least 8 characters long", 400);
  }

  if (/^[a-zA-Z0-9]+$/.test(newPassword)) {
    throw new AppError(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      400,
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new AppError(
      "New password and confirm new password do not match",
      400,
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User is not found", 404);
  }
  const isCurrentPasswordValid = await argon2.verify(
    user.password,
    currentPassword,
  );
  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = await argon2.hash(newPassword);
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new AppError("User is not found", 404);
  }
  res.status(200).json({ success: true, data: deletedUser });
});
