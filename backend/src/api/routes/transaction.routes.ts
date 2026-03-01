import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { authorize } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { memberRepository } from "../../data/repositories/member.repository";
import { transactionRepository } from "../../data/repositories/transaction.repository";

export const transactionRouter = Router();

transactionRouter.get("/my-history", authorize("MEMBER"), asyncHandler(async (req, res) => {
  const member = await memberRepository.findByUserId(req.user!.userId);
  if (!member) throw new AppError(404, "Member not found");
  const days = parseInt(req.query.days as string) || 30;
  const data = await transactionRepository.getHistory(member.id, days);
  res.json(data);
}));

transactionRouter.get("/me", authorize("MEMBER"), transactionController.getMy);
transactionRouter.get("/", authorize("ADMIN", "STAFF"), transactionController.getAll);
