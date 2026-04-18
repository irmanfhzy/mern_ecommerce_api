import express from "express";
import {
  getProfile,
  updateProfile,
  updateAccount,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authenticator.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/profile/account", updateAccount);
router.patch("/profile/password", changePassword);
router.delete("/profile/delete", deleteAccount);

export default router;
