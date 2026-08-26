import "./env.js";
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}
