import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { referralService } from "../../data/services/referral.service";
import { auditLogService } from "../../data/services/audit-log.service";

export const referralController = {
  getMyCode: asyncHandler(async (req: Request, res: Response) => {
    const code = await referralService.getReferralCode(req.user!.userId);
    res.json({ referralCode: code });
  }),

  apply: asyncHandler(async (req: Request, res: Response) => {
    const referral = await referralService.applyReferral(req.user!.userId, req.body.referralCode);
    await auditLogService.logFromReq(req, "REFERRAL_APPLIED", "Referral", referral.id);
    res.status(201).json(referral);
  }),

  getMyReferrals: asyncHandler(async (req: Request, res: Response) => {
    const referrals = await referralService.getMyReferrals(req.user!.userId);
    res.json(referrals);
  }),

  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const referrals = await referralService.getAllReferrals();
    res.json(referrals);
  }),
};
