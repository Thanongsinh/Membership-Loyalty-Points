import { prisma } from "../prisma";
import { reviewRepository } from "../repositories/review.repository";
import { AppError } from "../../core/utilities/errors";

export const reviewService = {
  async getByProduct(productId: string) {
    return reviewRepository.findByProduct(productId);
  },

  async create(memberId: string, data: { productId: string; orderId: string; rating: number; comment?: string }) {
    // Verify order is completed and belongs to member
    const order = await prisma.order.findFirst({
      where: { id: data.orderId, memberId, status: "COMPLETED" },
      include: { orderItems: true },
    });
    if (!order) throw new AppError(400, "Can only review products from completed orders");

    const hasProduct = order.orderItems.some((item) => item.productId === data.productId);
    if (!hasProduct) throw new AppError(400, "Product not in this order");

    const existing = await reviewRepository.findByMemberAndProduct(memberId, data.productId, data.orderId);
    if (existing) throw new AppError(400, "Already reviewed this product for this order");

    if (data.rating < 1 || data.rating > 5) throw new AppError(400, "Rating must be 1-5");

    const review = await reviewRepository.create({ memberId, ...data });
    await reviewRepository.updateProductRating(data.productId);
    return review;
  },
};
