import { Router } from "express";
import { featureFlagController } from "../controllers/feature-flag.controller";
import { authorize } from "../middleware/auth.middleware";
import { validate, createFeatureFlagSchema } from "../../core/utilities/validators";

const router = Router();

router.get("/", featureFlagController.getAll);
router.post("/", authorize("ADMIN"), validate(createFeatureFlagSchema), featureFlagController.create);
router.put("/:id", authorize("ADMIN"), featureFlagController.update);
router.patch("/:id/toggle", authorize("ADMIN"), featureFlagController.toggle);
router.delete("/:id", authorize("ADMIN"), featureFlagController.remove);

export default router;
