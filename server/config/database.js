import dns from "node:dns";
import mongoose from "mongoose";

const customDnsServers = process.env.CUSTOM_DNS_SERVERS;

if (customDnsServers) {
  const servers = customDnsServers.split(",").map((s) => s.trim());
  dns.setServers(servers);
  console.log("Using custom DNS servers:", servers);
}

const MONGODB_URL = process.env.MONGODB_URL;

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "mern_ecommerce",
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    console.log("MONGODB_URL exists:", !!MONGODB_URL);

    cached.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected:", mongooseInstance.connection.host);
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
