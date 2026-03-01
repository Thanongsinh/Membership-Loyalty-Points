import { Request, Response } from "express";
import { reviewService } from "../../data/services/review.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";

export const reviewController = {
  getByProduct: asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
    res.json(await reviewService.getByProduct(req.params.productId));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const review = await reviewService.create(member.id, req.body);
    res.status(201).json(review);
  }),
};
