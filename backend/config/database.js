import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mern_ecommerce");
    console.log("Database connected");
  } catch (error) {
    console.log("ERROR MESSAGE: ", error.message);
    process.exit(1);
  }
}
