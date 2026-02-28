import { Router } from "express";
import { authRouter } from "./auth.routes";
import { memberRouter } from "./member.routes";
import { rewardRouter } from "./reward.routes";
import { pointsRouter } from "./points.routes";
import { transactionRouter } from "./transaction.routes";
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
