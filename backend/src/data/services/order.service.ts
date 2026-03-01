import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";
import { memberService } from "./member.service";
import { notificationService } from "./notification.service";
import { sseService } from "./sse.service";

export const orderService = {
  async checkoutWithPoints(memberId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { memberId },
      include: { product: true },
    });
    if (!cartItems.length) throw new AppError(400, "Cart is empty");

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new AppError(404, "Member not found");

    // All items must support points purchase and be from same store
    const storeId = cartItems[0].product.storeId;
    let totalPoints = 0;
    for (const item of cartItems) {
      if (!item.product.pointsPrice) throw new AppError(400, `"${item.product.name}" cannot be purchased with points`);
      if (item.product.storeId !== storeId) throw new AppError(400, "Cart items must be from the same store");
      if (item.product.stock < item.quantity) throw new AppError(400, `"${item.product.name}" insufficient stock`);
      totalPoints += item.product.pointsPrice * item.quantity;
    }

    if (member.currentPoints < totalPoints) throw new AppError(400, "Insufficient points");

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          memberId, storeId,
          status: "CONFIRMED",
          paymentMethod: "POINTS",
          pointsUsed: totalPoints,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: 0,
              totalPrice: 0,
            })),
          },
        },
        include: { orderItems: true },
      });

      await tx.member.update({
        where: { id: memberId },
        data: { currentPoints: { decrement: totalPoints } },
      });

      await tx.transaction.create({
        data: { memberId, type: "REDEEM", points: -totalPoints, description: `Store order #${newOrder.orderNumber.slice(0, 8)}` },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { memberId } });

      return newOrder;
    });

    await notificationService.create({
      userId: member.userId,
      type: "REWARD",
      title: "Order Placed",
      message: `Order #${order.orderNumber.slice(0, 8)} placed with ${totalPoints} points.`,
    });

    return order;
  },

  async createCashOrder(storeId: string, memberId: string, items: Array<{ productId: string; quantity: number }>, paymentMethod: string) {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let subtotal = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new AppError(404, "Product not found");
      if (product.stock < item.quantity) throw new AppError(400, `"${product.name}" insufficient stock`);
      subtotal += product.price * item.quantity;
    }

    const pointsToEarn = Math.floor(subtotal);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          memberId, storeId,
          status: "COMPLETED",
          paymentMethod: paymentMethod as any,
          subtotal, totalAmount: subtotal,
          orderItems: {
            create: items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: product.price * item.quantity,
              };
            }),
          },
        },
      });

      if (pointsToEarn > 0) {
        await tx.member.update({
          where: { id: memberId },
          data: { currentPoints: { increment: pointsToEarn }, totalPoints: { increment: pointsToEarn } },
        });
        await tx.transaction.create({
          data: { memberId, type: "EARN", points: pointsToEarn, description: `Purchase at store - Order #${newOrder.orderNumber.slice(0, 8)}` },
        });
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (member && pointsToEarn > 0) {
      await memberService.recalculateTier(memberId);
      await notificationService.notifyPointsEarned(member.userId, pointsToEarn, "Store purchase");
    }

    return order;
  },

  async updateStatus(orderId: string, status: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: { member: true },
    });
    if (order.member) {
      sseService.broadcastOrderUpdate(order.member.userId, {
        id: order.id, orderNumber: order.orderNumber, status: order.status,
      });
      await notificationService.create({
        userId: order.member.userId,
        type: "ORDER" as any,
        title: "Order Updated",
        message: `Order #${order.orderNumber.slice(0, 8)} is now ${status}.`,
      });
    }
    return order;
  },

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { member: { include: { user: { select: { email: true } } } }, store: true, orderItems: true },
    });
    if (!order) throw new AppError(404, "Order not found");
    return order;
  },

  async getByMember(memberId: string, params: PaginationParams) {
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { memberId }, skip: params.skip, take: params.limit,
        include: { store: { select: { name: true } }, orderItems: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { memberId } }),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getAll(params: PaginationParams, storeId?: string, status?: string) {
    const where: any = {};
    if (storeId) where.storeId = storeId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where, skip: params.skip, take: params.limit,
        include: { member: { select: { firstName: true, lastName: true } }, store: { select: { name: true } }, orderItems: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);
    return paginatedResponse(data, total, params);
  },
};
