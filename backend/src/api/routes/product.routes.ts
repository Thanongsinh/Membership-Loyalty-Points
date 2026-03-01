import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authorize } from "../middleware/auth.middleware";

export const productRouter = Router();

productRouter.get("/", productController.getAll);
productRouter.get("/:id", productController.getById);
productRouter.post("/", authorize("ADMIN"), productController.create);
productRouter.put("/:id", authorize("ADMIN"), productController.update);
productRouter.delete("/:id", authorize("ADMIN"), productController.remove);
