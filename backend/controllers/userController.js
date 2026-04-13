import argon2 from "argon2";
import User from "../models/User.js";

export async function findUser(req, res) {
  try {
    const { name } = req.query;
    const users = User.find({ name: { $regex: name, $options: i } });
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "Users are not found" });
    }

    (res.status(200), json({ success: true, data: users }));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, gender, dataOfBirth, image } = req.body;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
