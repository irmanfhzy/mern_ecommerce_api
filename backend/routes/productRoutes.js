import express from "express";
import validateObjectId from "../middlewares/objectIdValidator.js";
import {
  addProduct,
  deleteProductById,
  findAllProducts,
  findProductById,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);

router.get("/", findAllProducts);

router.get("/:id", validateObjectId, findProductById);

router.put("/:id", validateObjectId, updateProduct);

router.delete("/:id", validateObjectId, deleteProductById);

export default router;
