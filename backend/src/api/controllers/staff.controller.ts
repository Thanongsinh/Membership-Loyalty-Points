import { Request, Response } from "express";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { prisma } from "../../data/prisma";
import { orderService } from "../../data/services/order.service";
import { parsePagination } from "../../core/utilities/pagination";
import { paginatedResponse } from "../../core/utilities/pagination";

export const staffController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const staffStore = await prisma.storeStaff.findFirst({ where: { userId: req.user!.userId } });
    if (!staffStore) throw new AppError(403, "Not assigned to any store");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pendingOrders, todayOrders, todayRevenue] = await Promise.all([
      prisma.order.count({ where: { storeId: staffStore.storeId, status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } } }),
      prisma.order.count({ where: { storeId: staffStore.storeId, createdAt: { gte: today } } }),
      prisma.order.aggregate({ where: { storeId: staffStore.storeId, createdAt: { gte: today }, status: "COMPLETED" }, _sum: { totalAmount: true } }),
    ]);

    const store = await prisma.store.findUnique({ where: { id: staffStore.storeId }, select: { id: true, name: true } });

    res.json({
      store,
      pendingOrders,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
    });
  }),

  getOrders: asyncHandler(async (req: Request, res: Response) => {
    const staffStore = await prisma.storeStaff.findFirst({ where: { userId: req.user!.userId } });
    if (!staffStore) throw new AppError(403, "Not assigned to any store");
    const params = parsePagination(req);
    const status = req.query.status as string | undefined;
    res.json(await orderService.getAll(params, staffStore.storeId, status));
  }),

  updateOrderStatus: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.json(order);
  }),

  earnPoints: asyncHandler(async (req: Request, res: Response) => {
    const staffStore = await prisma.storeStaff.findFirst({ where: { userId: req.user!.userId } });
    if (!staffStore) throw new AppError(403, "Not assigned to any store");
    const { storeId, memberId, items, paymentMethod } = req.body;
    const order = await orderService.createCashOrder(storeId || staffStore.storeId, memberId, items, paymentMethod || "CASH");
    res.status(201).json(order);
  }),
};
