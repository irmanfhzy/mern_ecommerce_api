import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/database.js";

await connectDB();

export default app;
