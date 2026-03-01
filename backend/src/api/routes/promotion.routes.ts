import { Router } from "express";
import { promotionController } from "../controllers/promotion.controller";
import { authorize } from "../middleware/auth.middleware";

export const promotionRouter = Router();

promotionRouter.get("/", promotionController.getAll);
promotionRouter.get("/:id", promotionController.getById);
promotionRouter.post("/", authorize("ADMIN"), promotionController.create);
promotionRouter.put("/:id", authorize("ADMIN"), promotionController.update);
promotionRouter.delete("/:id", authorize("ADMIN"), promotionController.delete);
promotionRouter.post("/apply", authorize("MEMBER"), promotionController.applyCode);
