import { Request, Response } from "express";
import { promotionService } from "../../data/services/promotion.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const promotionController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const activeOnly = req.user!.role === "MEMBER";
    res.json(await promotionService.getAll(params, activeOnly));
  }),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await promotionService.getById(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const promo = await promotionService.create({ ...req.body, code: req.body.code.toUpperCase() });
    res.status(201).json(promo);
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await promotionService.update(req.params.id, req.body));
  }),

  delete: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await promotionService.delete(req.params.id);
    res.status(204).end();
  }),

  applyCode: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const { code, subtotal, storeId } = req.body;
    res.json(await promotionService.applyCode(code, member.id, subtotal, storeId));
  }),
};
