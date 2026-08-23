import dns from "node:dns";
import "./config/env.js";

import app from "./app.js";

import connectDB from "./config/database.js";

const startServer = async () => {
  try {
    dns.setServers(["1.1.1.1"]);
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log("Server started successfully");
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
};

startServer();
