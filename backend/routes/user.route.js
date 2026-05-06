import express from "express";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import normalizeRequest from "../middlewares/requestNormalizer.middleware.js";
import {
  profileRules,
  accountRules,
  addressRules,
} from "../utils/normalizerRules.js";
import {
  getProfileController,
  updateProfileController,
  updateAccountController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  changePasswordController,
  deleteUserController,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticator.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(validateObjectId("user", "userId"));

router.get("/profile", getProfileController);

router.patch(
  "/profile",
  normalizeRequest(profileRules),
  updateProfileController,
);

router.patch(
  "/profile/account",
  normalizeRequest(accountRules),
  updateAccountController,
);

router.post(
  "/profile/address",
  normalizeRequest(addressRules),
  addAddressController,
);

router.patch(
  "/profile/address/:id",
  validateObjectId("params", "id"),
  normalizeRequest(addressRules),
  updateAddressController,
);

router.delete(
  "/profile/address/:id",
  validateObjectId("params", "id"),
  deleteAddressController,
);

router.patch("/profile/password", changePasswordController);

router.delete("/profile", deleteUserController);

export default router;
