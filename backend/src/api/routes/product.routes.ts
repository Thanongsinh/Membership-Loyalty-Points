import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../../core/utilities/errors";
import { productRepository } from "../../data/repositories/product.repository";

export const productRouter = Router();

productRouter.get("/", productController.getAll);
productRouter.get("/:id", productController.getById);
productRouter.post("/", authorize("ADMIN"), productController.create);
productRouter.put("/:id", authorize("ADMIN"), productController.update);
productRouter.delete("/:id", authorize("ADMIN"), productController.remove);

// Product Images
productRouter.get("/:id/images", asyncHandler(async (req, res) => {
  const images = await productRepository.findImages(req.params.id);
  res.json(images);
}));

productRouter.post("/:id/images", authorize("ADMIN", "STAFF"), asyncHandler(async (req, res) => {
  const { url, sortOrder } = req.body;
  const image = await productRepository.addImage(req.params.id, url, sortOrder ?? 0);
  res.status(201).json(image);
}));

productRouter.delete("/images/:imageId", authorize("ADMIN"), asyncHandler(async (req, res) => {
  await productRepository.removeImage(req.params.imageId);
  res.json({ message: "Image removed" });
}));
