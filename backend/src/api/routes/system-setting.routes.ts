import { Router } from "express";
import { systemSettingController } from "../controllers/system-setting.controller";
import { authorize } from "../middleware/auth.middleware";
import { validate, upsertSettingSchema } from "../../core/utilities/validators";

const router = Router();

router.get("/", systemSettingController.getAll);
router.get("/group/:group", systemSettingController.getByGroup);
router.post("/", authorize("ADMIN"), validate(upsertSettingSchema), systemSettingController.upsert);
router.patch("/:id", authorize("ADMIN"), systemSettingController.updateValue);
router.delete("/:id", authorize("ADMIN"), systemSettingController.remove);

export default router;
