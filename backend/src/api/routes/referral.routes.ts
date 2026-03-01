import { Router } from "express";
import { referralController } from "../controllers/referral.controller";
import { authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-code", referralController.getMyCode);
router.post("/apply", referralController.apply);
router.get("/my-referrals", referralController.getMyReferrals);
router.get("/", authorize("ADMIN", "STAFF"), referralController.getAll);

export default router;
