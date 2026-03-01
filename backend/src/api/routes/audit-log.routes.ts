import { Router } from "express";
import { auditLogController } from "../controllers/audit-log.controller";
import { authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authorize("ADMIN"), auditLogController.getAll);

export default router;
