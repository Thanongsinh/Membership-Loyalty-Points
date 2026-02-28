import { Router } from "express";
import { pointsController } from "../controllers/points.controller";
import { authorize } from "../middleware/auth.middleware";

export const pointsRouter = Router();

pointsRouter.post("/earn", authorize("ADMIN", "STAFF"), pointsController.earn);
pointsRouter.post("/adjust", authorize("ADMIN"), pointsController.adjust);
