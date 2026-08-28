import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// Cache koneksi di global object supaya bertahan antar invocation
// selama function instance masih "warm" (tidak cold start).
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Kalau sudah connected dan state-nya sehat, langsung pakai ulang
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Kalau belum ada promise koneksi yang sedang berjalan, buat baru
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // penting: jangan buffer command diam-diam, biar gagal cepat & jelas
      maxPoolSize: 10,
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
        cached.promise = null; // reset supaya retry di request berikutnya, bukan stuck gagal terus
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
