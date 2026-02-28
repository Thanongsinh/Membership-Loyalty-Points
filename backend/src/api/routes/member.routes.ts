import { Router } from "express";
import { memberController } from "../controllers/member.controller";
import { authorize } from "../middleware/auth.middleware";

export const memberRouter = Router();

memberRouter.get("/me", authorize("MEMBER"), memberController.getProfile);
memberRouter.put("/me", authorize("MEMBER"), memberController.updateProfile);
memberRouter.get("/", authorize("ADMIN", "STAFF"), memberController.getAll);
memberRouter.get("/:id", authorize("ADMIN", "STAFF"), memberController.getById);
