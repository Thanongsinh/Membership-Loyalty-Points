import { Request, Response } from "express";
import { memberService } from "../../data/services/member.service";
import { asyncHandler } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const memberController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const result = await memberService.getAll(params);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberService.getById(req.params.id);
    res.json(member);
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberService.getProfile(req.user!.userId);
    res.json(member);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberService.updateProfile(req.user!.userId, req.body);
    res.json(member);
  }),
};
