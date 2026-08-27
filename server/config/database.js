import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGODB_URL exists:", !!process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
