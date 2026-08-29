import dns from "node:dns";
import mongoose from "mongoose";

// Paksa Node.js pakai DNS server tertentu untuk resolusi SRV record — ini
// fix untuk kasus router/ISP lokal (misal di Windows) yang tidak mendukung
// dengan baik cara Node.js (c-ares) melakukan query DNS SRV.
//
// Dikontrol lewat env var CUSTOM_DNS_SERVERS (isinya list IP dipisah koma,
// misal "8.8.8.8,1.1.1.1"). Kalau env var ini TIDAK di-set, baris ini
// dilewati sepenuhnya — jadi cukup isi di ".env" lokal saja, dan JANGAN
// diisi di Vercel Environment Variables, supaya production tidak terpengaruh.
const customDnsServers = process.env.CUSTOM_DNS_SERVERS;

if (customDnsServers) {
  const servers = customDnsServers.split(",").map((s) => s.trim());
  dns.setServers(servers);
  console.log("Using custom DNS servers:", servers);
}

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
