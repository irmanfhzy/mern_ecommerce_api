import express from "express";

import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;

// Sengaja mount di bawah "/api", supaya path yang dipanggil dari client
// SAMA PERSIS antara lokal dan production (Vercel).
// Contoh: http://localhost:5000/api/products
const server = express();
server.use("/api", app);

// Ini bagian yang TIDAK ADA di Vercel (api/index.js), karena Vercel
// yang otomatis "menyalakan" function-nya. Di lokal, kita yang harus
// manual bikin server nyala dan dengarkan port tertentu.
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server jalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal start server:", error.message);
    process.exit(1);
  }
};

startServer();
