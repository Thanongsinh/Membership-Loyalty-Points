import { Router } from "express";
import { rewardController } from "../controllers/reward.controller";
import { authorize } from "../middleware/auth.middleware";
import { validate, createRewardSchema } from "../../core/utilities/validators";

export const rewardRouter = Router();

rewardRouter.get("/", rewardController.getAll);
rewardRouter.get("/:id", rewardController.getById);
rewardRouter.post("/", authorize("ADMIN"), validate(createRewardSchema), rewardController.create);
rewardRouter.put("/:id", authorize("ADMIN"), rewardController.update);
rewardRouter.delete("/:id", authorize("ADMIN"), rewardController.remove);
rewardRouter.post("/:id/redeem", authorize("MEMBER"), rewardController.redeem);
