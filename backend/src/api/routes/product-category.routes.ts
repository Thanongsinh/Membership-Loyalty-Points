import { Router } from "express";
import { productCategoryController } from "../controllers/product-category.controller";
import { authorize } from "../middleware/auth.middleware";

export const productCategoryRouter = Router();

productCategoryRouter.get("/", productCategoryController.getAll);
productCategoryRouter.get("/:id", productCategoryController.getById);
productCategoryRouter.post("/", authorize("ADMIN"), productCategoryController.create);
productCategoryRouter.put("/:id", authorize("ADMIN"), productCategoryController.update);
productCategoryRouter.delete("/:id", authorize("ADMIN"), productCategoryController.remove);
