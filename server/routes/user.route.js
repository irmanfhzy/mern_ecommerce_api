import express from "express";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import normalizeRequestBody from "../middlewares/requestBodyNormalizer.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import rules from "../validations/normalizerRules.js";
import requestBodySchemas from "../validations/requestBodySchemas.js";

import {
  searchUsersController,
  getProfileController,
  updateProfileController,
  updateEmailController,
  updateUsernameController,
  updatePhoneController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  changePasswordController,
  deleteUserController,
} from "../controllers/user.controller.js";

import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import { ROLE } from "@ecommerce/shared/constants/index.js";

const router = express.Router();

router.use(authenticate);

router.get("/admin/search", authorize(ROLE.ADMIN), searchUsersController);

router.get("/profile", getProfileController);

router.patch(
  "/profile",
  upload.single("image"),
  validateRequestBody(requestBodySchemas.profile.update),
  normalizeRequestBody(rules.profile),
  updateProfileController,
);

router.patch(
  "/profile/account/email",
  validateRequestBody(requestBodySchemas.account.email),
  normalizeRequestBody(rules.account.email),
  updateEmailController,
);

router.patch(
  "/profile/account/username",
  validateRequestBody(requestBodySchemas.account.username),
  normalizeRequestBody(rules.account.username),
  updateUsernameController,
);

router.patch(
  "/profile/account/phone",
  validateRequestBody(requestBodySchemas.account.phone),
  normalizeRequestBody(rules.account.phone),
  updatePhoneController,
);

router.post(
  "/profile/addresses",
  validateRequestBody(requestBodySchemas.address.create),
  normalizeRequestBody(rules.address),
  addAddressController,
);

router.put(
  "/profile/addresses/:id",
  validateObjectId("params", "id"),
  validateRequestBody(requestBodySchemas.address.update),
  normalizeRequestBody(rules.address),
  updateAddressController,
);

router.delete(
  "/profile/addresses/:id",
  validateObjectId("params", "id"),
  deleteAddressController,
);

router.patch(
  "/profile/password",
  validateRequestBody(requestBodySchemas.password.update),
  changePasswordController,
);

router.delete("/profile", deleteUserController);

export default router;
