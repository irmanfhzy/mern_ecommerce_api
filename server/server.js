console.log("🔥 SERVER.JS LOADED");

import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/database.js";

console.log("🔥 BEFORE CONNECT DB");

await connectDB();

console.log("🔥 AFTER CONNECT DB");

export default app;
