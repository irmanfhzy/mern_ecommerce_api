import express from "express";
import normalizeRequest from "../middlewares/normalizer.middleware.js";
import validateObjectId from "../middlewares/idValidator.middleware.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import {
  addProductController,
  deleteProductByIdController,
  getPublicProductsController,
  getAdminProductsController,
  getProductByIdController,
  updateProductController,
  searchProductsController,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getPublicProductsController);
router.get("/search", searchProductsController);
router.get("/:id", validateObjectId("params", "id"), getProductByIdController);

router.use(authenticate);
router.use(authorize("admin"));
router.use(normalizeRequest());

router.post("/", addProductController);
router.get("/admin", getAdminProductsController);
router.put("/:id", validateObjectId("params", "id"), updateProductController);
router.delete(
  "/:id",
  validateObjectId("params", "id"),
  deleteProductByIdController,
);

export default router;
