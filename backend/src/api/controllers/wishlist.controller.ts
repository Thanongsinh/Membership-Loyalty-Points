import { Request, Response } from "express";
import { wishlistService } from "../../data/services/wishlist.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";

export const wishlistController = {
  getMyWishlist: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    res.json(await wishlistService.getByMember(member.id));
  }),

  toggle: asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    res.json(await wishlistService.toggle(member.id, req.params.productId));
  }),
};
