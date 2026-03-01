import { Router } from "express";
import { authRouter } from "./auth.routes";
import { memberRouter } from "./member.routes";
import { rewardRouter } from "./reward.routes";
import { pointsRouter } from "./points.routes";
import { transactionRouter } from "./transaction.routes";
import featureFlagRoutes from "./feature-flag.routes";
import systemSettingRoutes from "./system-setting.routes";
import auditLogRoutes from "./audit-log.routes";
import campaignRoutes from "./campaign.routes";
import notificationRoutes from "./notification.routes";
import referralRoutes from "./referral.routes";
import { authenticate } from "../middleware/auth.middleware";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRouter);
router.use("/members", authenticate, memberRouter);
router.use("/rewards", authenticate, rewardRouter);
router.use("/points", authenticate, pointsRouter);
router.use("/transactions", authenticate, transactionRouter);
router.use("/feature-flags", authenticate, featureFlagRoutes);
router.use("/settings", authenticate, systemSettingRoutes);
router.use("/audit-logs", authenticate, auditLogRoutes);
router.use("/campaigns", authenticate, campaignRoutes);
router.use("/notifications", authenticate, notificationRoutes);
router.use("/referrals", authenticate, referralRoutes);
