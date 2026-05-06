import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(",") });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res
      .status(400)
      .json({ success: false, message: `${field} already exist` });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ success: false, message: "Token expired" });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  if (err.status) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
