import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const findUser = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const users = User.find({ name: { $regex: name, $options: "i" } });
  if (!users || users.length === 0) {
    throw new AppError("Users are not found", 404);
  }
  res.status(200).json({ success: true, data: users });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, gender, dataOfBirth, image } = req.body;
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ success: true, data: user });
});
