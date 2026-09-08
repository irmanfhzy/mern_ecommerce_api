import express from "express";

import "../config/env.js";
import app from "../app.js";
import connectDB from "../config/database.js";

connectDB().catch((err) => {
  console.error("Initial DB connect failed:", err.message);
});

const server = express();
server.use("/api", app);

export default server;
