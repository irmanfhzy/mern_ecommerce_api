import express from "express";

import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT;

const server = express();
server.use("/api", app);

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
