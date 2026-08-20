import asyncHandler from "../utils/asyncHandler.js";

import * as paymentService from "../services/payment.service.js";

export const handlePaymentWebhookController = asyncHandler(async (req, res) => {
  console.log("=== WEBHOOK CONTROLLER HIT ===");
  console.log("BODY:", req.body);
  const data = await paymentService.handlePaymentNotification(req.body);
  res.status(200).json({ success: true, data });
});
