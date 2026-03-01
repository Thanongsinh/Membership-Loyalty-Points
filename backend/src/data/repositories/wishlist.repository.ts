import { prisma } from "../prisma";

export const wishlistRepository = {
  findByMember(memberId: string) {
    return prisma.wishlist.findMany({
      where: { memberId },
      include: { product: { include: { store: { select: { name: true } }, category: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findOne(memberId: string, productId: string) {
    return prisma.wishlist.findUnique({
      where: { memberId_productId: { memberId, productId } },
    });
  },

  create(memberId: string, productId: string) {
    return prisma.wishlist.create({ data: { memberId, productId } });
  },

  delete(memberId: string, productId: string) {
    return prisma.wishlist.delete({
      where: { memberId_productId: { memberId, productId } },
    });
  },
};
