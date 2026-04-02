import express from "express";
import validateObjectId from "../middlewares/validateObjectId.js";
import {
  createProduct,
  deleteProductById,
  findAllProducts,
  findProductById,
  updateProduct,
} from "../controller/productController.js";

const router = express.Router();

router.post("/", createProduct);

router.get("/", findAllProducts);

router.get("/:id", validateObjectId, findProductById);

router.put("/:id", validateObjectId, updateProduct);

router.delete("/:id", validateObjectId, deleteProductById);

export default router;
