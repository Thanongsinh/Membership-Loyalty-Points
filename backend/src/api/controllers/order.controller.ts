import { Request, Response } from "express";
import { orderService } from "../../data/services/order.service";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const orderController = {
  // Member: checkout cart with points
  checkout: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const order = await orderService.checkoutWithPoints(member.id);
    res.status(201).json(order);
  }),

  // Staff/Admin: create cash order for a member
  createCashOrder: asyncHandler(async (req: Request, res: Response) => {
    const { storeId, memberId, items, paymentMethod } = req.body;
    const order = await orderService.createCashOrder(storeId, memberId, items, paymentMethod);
    res.status(201).json(order);
  }),

  // Admin/Staff: update order status
  updateStatus: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.json(order);
  }),

  // Member: get my orders
  getMyOrders: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const params = parsePagination(req);
    res.json(await orderService.getByMember(member.id, params));
  }),

  // Admin/Staff: get all orders
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const storeId = req.query.storeId as string | undefined;
    const status = req.query.status as string | undefined;
    res.json(await orderService.getAll(params, storeId, status));
  }),

  // Get single order
  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await orderService.getById(req.params.id));
  }),
};
