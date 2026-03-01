import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authorize } from "../middleware/auth.middleware";

export const orderRouter = Router();

orderRouter.get("/me", authorize("MEMBER"), orderController.getMyOrders);
orderRouter.post("/checkout", authorize("MEMBER"), orderController.checkout);
orderRouter.post("/cash", authorize("ADMIN", "STAFF"), orderController.createCashOrder);
orderRouter.get("/", authorize("ADMIN", "STAFF"), orderController.getAll);
orderRouter.get("/:id", orderController.getById);
orderRouter.patch("/:id/status", authorize("ADMIN", "STAFF"), orderController.updateStatus);
