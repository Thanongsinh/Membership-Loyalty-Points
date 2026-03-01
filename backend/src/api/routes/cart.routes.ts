import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authorize } from "../middleware/auth.middleware";

export const cartRouter = Router();

cartRouter.get("/", authorize("MEMBER"), cartController.getMyCart);
cartRouter.post("/", authorize("MEMBER"), cartController.addItem);
cartRouter.put("/:productId", authorize("MEMBER"), cartController.updateItem);
cartRouter.delete("/clear", authorize("MEMBER"), cartController.clearCart);
cartRouter.delete("/:productId", authorize("MEMBER"), cartController.removeItem);
