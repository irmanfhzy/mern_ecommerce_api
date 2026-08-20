import express from "express";

import { handlePaymentWebhookController } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/webhook", handlePaymentWebhookController);

export default router;
