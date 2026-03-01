import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";

export const cartService = {
  async getMyCart(memberId: string) {
    return prisma.cartItem.findMany({
      where: { memberId },
      include: { product: { include: { store: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async addItem(memberId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) throw new AppError(404, "Product not found or inactive");
    if (product.stock < quantity) throw new AppError(400, "Insufficient stock");

    return prisma.cartItem.upsert({
      where: { memberId_productId: { memberId, productId } },
      update: { quantity },
      create: { memberId, productId, quantity },
    });
  },

  async updateQuantity(memberId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(memberId, productId);
    }
    return prisma.cartItem.update({
      where: { memberId_productId: { memberId, productId } },
      data: { quantity },
    });
  },

  async removeItem(memberId: string, productId: string) {
    return prisma.cartItem.delete({
      where: { memberId_productId: { memberId, productId } },
    });
  },

  async clearCart(memberId: string) {
    return prisma.cartItem.deleteMany({ where: { memberId } });
  },
};
