import { Router } from "express";
import { campaignController } from "../controllers/campaign.controller";
import { authorize } from "../middleware/auth.middleware";
import { validate, createCampaignSchema } from "../../core/utilities/validators";

const router = Router();

router.get("/", campaignController.getAll);
router.get("/active", campaignController.getActive);
router.get("/:id", campaignController.getById);
router.post("/", authorize("ADMIN"), validate(createCampaignSchema), campaignController.create);
router.put("/:id", authorize("ADMIN"), campaignController.update);
router.patch("/:id/status", authorize("ADMIN"), campaignController.updateStatus);
router.delete("/:id", authorize("ADMIN"), campaignController.remove);

export default router;
