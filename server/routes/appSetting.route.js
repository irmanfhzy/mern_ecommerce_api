import express from "express";

import {
  getAppSetting,
  saveAppSetting,
} from "../controllers/appSetting.controller.js";

import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";
import { ROLE } from "@ecommerce/shared/constants/index.js";

import { APP_SETTING_UPLOAD_FIELDS } from "../constants/uploadField.constant.js";

const router = express.Router();

router.get("/", getAppSetting);

router.put(
  "/",
  authenticate,
  authorize(ROLE.ADMIN),
  upload.fields(APP_SETTING_UPLOAD_FIELDS),
  validateRequestBody(requestBodySchemas.appSetting.save),
  saveAppSetting,
);

export default router;
