import { Request, Response } from "express";
import { rewardService } from "../../data/services/reward.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const rewardController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const activeOnly = req.user!.role === "MEMBER";
    const result = await rewardService.getAll(params, activeOnly);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const reward = await rewardService.getById(req.params.id);
    res.json(reward);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const reward = await rewardService.create(req.body);
    res.status(201).json(reward);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const reward = await rewardService.update(req.params.id, req.body);
    res.json(reward);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await rewardService.remove(req.params.id);
    res.json({ message: "Reward deleted" });
  }),

  redeem: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const redemption = await rewardService.redeem(member.id, req.params.id);
    res.status(201).json(redemption);
  }),
};
