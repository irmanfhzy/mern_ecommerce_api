import express from "express";
import { getDasboardController } from "../controllers/dashboard.controller.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import { ROLE } from "@ecommerce/shared/constants/index.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLE.ADMIN));

router.get("/dashboard", getDasboardController);

export default router;
