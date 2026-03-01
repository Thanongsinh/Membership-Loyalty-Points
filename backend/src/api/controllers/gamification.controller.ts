import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { gamificationService } from "../../data/services/gamification.service";

export const gamificationController = {
  checkIn: asyncHandler(async (req: Request, res: Response) => {
    const result = await gamificationService.checkIn(req.user!.userId);
    res.json(result);
  }),

  getBadges: asyncHandler(async (req: Request, res: Response) => {
    const badges = await gamificationService.getMemberBadges(req.user!.userId);
    res.json(badges);
  }),

  getBadgeDefinitions: asyncHandler(async (_req: Request, res: Response) => {
    res.json(gamificationService.getBadgeDefinitions());
  }),
};
