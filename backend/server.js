import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
startServer();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

async function startServer() {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
