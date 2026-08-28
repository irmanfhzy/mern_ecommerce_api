import express from "express";
import cors from "cors";

import connectDB from "./config/database.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import variantRoutes from "./routes/variant.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import InventoryHistoryRoutes from "./routes/inventoryHistory.route.js";
import appSettingRoutes from "./routes/appSetting.route.js";
import adminRoutes from "./routes/admin.route.js";
import paymentRoutes from "./routes/payment.route.js";

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Pastikan koneksi DB siap SEBELUM request menyentuh route apapun
// yang butuh database. Ini mencegah "buffering timed out" di serverless,
// karena tiap request akan reconnect kalau koneksi sebelumnya sudah stale.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error on request:", error.message);
    res.status(503).json({ message: "Database connection failed" });
  }
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/variants", variantRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/inventory-histories", InventoryHistoryRoutes);
app.use("/app-setting", appSettingRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);

app.use(errorHandler);

export default app;
