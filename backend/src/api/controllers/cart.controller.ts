import { Request, Response } from "express";
import { cartService } from "../../data/services/cart.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";

export const cartController = {
  getMyCart: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    res.json(await cartService.getMyCart(member.id));
  }),

  addItem: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const { productId, quantity } = req.body;
    res.json(await cartService.addItem(member.id, productId, quantity || 1));
  }),

  updateItem: asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    res.json(await cartService.updateQuantity(member.id, req.params.productId, req.body.quantity));
  }),

  removeItem: asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    await cartService.removeItem(member.id, req.params.productId);
    res.json({ message: "Item removed" });
  }),

  clearCart: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    await cartService.clearCart(member.id);
    res.json({ message: "Cart cleared" });
  }),
};
