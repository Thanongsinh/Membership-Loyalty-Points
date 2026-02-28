import { Request, Response } from "express";
import { pointsService } from "../../data/services/points.service";
import { asyncHandler } from "../../core/utilities/errors";

export const pointsController = {
  earn: asyncHandler(async (req: Request, res: Response) => {
    const { memberId, points, description } = req.body;
    const member = await pointsService.earn(memberId, points, description);
    res.json(member);
  }),

  adjust: asyncHandler(async (req: Request, res: Response) => {
    const { memberId, points, description } = req.body;
    const member = await pointsService.adjust(memberId, points, description);
    res.json(member);
  }),
};
