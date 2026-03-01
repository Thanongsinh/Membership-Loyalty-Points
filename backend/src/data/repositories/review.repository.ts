import { prisma } from "../prisma";

export const reviewRepository = {
  findByProduct(productId: string) {
    return prisma.productReview.findMany({
      where: { productId },
      include: { member: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findByMemberAndProduct(memberId: string, productId: string, orderId: string) {
    return prisma.productReview.findUnique({
      where: { memberId_productId_orderId: { memberId, productId, orderId } },
    });
  },

  create(data: { memberId: string; productId: string; orderId: string; rating: number; comment?: string }) {
    return prisma.productReview.create({ data });
  },

  async updateProductRating(productId: string) {
    const agg = await prisma.productReview.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return prisma.product.update({
      where: { id: productId },
      data: { averageRating: agg._avg.rating || 0, reviewCount: agg._count.rating },
    });
  },
};
