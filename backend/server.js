import express from "express";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
startServer();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/products", productRoutes);

async function startServer() {
  await connectDB();
  app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
  });
}
