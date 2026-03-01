import { Request, Response } from "express";
import { orderService } from "../../data/services/order.service";
import { asyncHandler } from "../../core/utilities/errors";

export const receiptController = {
  getReceipt: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const order = await orderService.getById(req.params.id);
    res.json({
      orderNumber: order.orderNumber,
      date: order.createdAt,
      store: order.store,
      member: order.member,
      items: order.orderItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.totalPrice,
      })),
      subtotal: order.subtotal,
      discount: order.discountAmount,
      pointsUsed: order.pointsUsed,
      total: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
    });
  }),
};
