import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/dashboard", authorize("ADMIN", "STAFF"), analyticsController.getDashboard);
router.get("/export/csv", authorize("ADMIN", "STAFF"), analyticsController.exportCsv);

export default router;
