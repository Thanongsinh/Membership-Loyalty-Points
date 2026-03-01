import { Router } from "express";
import { staffController } from "../controllers/staff.controller";
import { authorize } from "../middleware/auth.middleware";

export const staffRouter = Router();

staffRouter.get("/dashboard", authorize("STAFF", "ADMIN"), staffController.getDashboard);
staffRouter.get("/orders", authorize("STAFF", "ADMIN"), staffController.getOrders);
staffRouter.patch("/orders/:id/status", authorize("STAFF", "ADMIN"), staffController.updateOrderStatus);
staffRouter.post("/earn-points", authorize("STAFF", "ADMIN"), staffController.earnPoints);
