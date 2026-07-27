import "./env.js";
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("ERROR MESSAGE: ", error.message);
    process.exit(1);
  }
}
