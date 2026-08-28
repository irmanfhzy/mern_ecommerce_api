import express from "express";

import "../config/env.js";
import app from "../app.js";
import connectDB from "../config/database.js";

// Warm-up saat cold start. Request tetap aman kalau ini gagal/lambat,
// karena app.js sudah punya middleware yang cek ulang koneksi per request.
connectDB().catch((err) => {
  console.error("Initial DB connect failed:", err.message);
});

// Bungkus app di bawah prefix /api, supaya route internal di app.js
// (yang ditulis tanpa prefix, misal "/products") tetap bisa match
// saat client memanggil "/api/products". Express otomatis menghilangkan
// prefix "/api" dari req.url sebelum diteruskan ke sub-app.
const server = express();
server.use("/api", app);

export default server;
