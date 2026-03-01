import { Router } from "express";
import { pointsController } from "../controllers/points.controller";
import { authorize } from "../middleware/auth.middleware";
import { validate, earnPointsSchema, adjustPointsSchema } from "../../core/utilities/validators";

export const pointsRouter = Router();

pointsRouter.post("/earn", authorize("ADMIN", "STAFF"), validate(earnPointsSchema), pointsController.earn);
pointsRouter.post("/adjust", authorize("ADMIN"), validate(adjustPointsSchema), pointsController.adjust);
