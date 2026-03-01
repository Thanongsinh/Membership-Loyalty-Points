import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { authorize } from "../middleware/auth.middleware";

export const storeRouter = Router();

storeRouter.get("/", storeController.getAll);
storeRouter.get("/:id", storeController.getById);
storeRouter.post("/", authorize("ADMIN"), storeController.create);
storeRouter.put("/:id", authorize("ADMIN"), storeController.update);
storeRouter.delete("/:id", authorize("ADMIN"), storeController.remove);
storeRouter.get("/:id/staff", authorize("ADMIN", "STAFF"), storeController.getStaff);
storeRouter.post("/:id/staff", authorize("ADMIN"), storeController.assignStaff);
storeRouter.delete("/:id/staff/:userId", authorize("ADMIN"), storeController.removeStaff);
