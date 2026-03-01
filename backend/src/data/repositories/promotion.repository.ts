import { prisma } from "../prisma";

export const promotionRepository = {
  findAll(skip: number, limit: number, activeOnly = false) {
    const where: any = {};
    if (activeOnly) {
      where.isActive = true;
      where.startDate = { lte: new Date() };
      where.endDate = { gte: new Date() };
    }
    return prisma.promotion.findMany({
      skip, take: limit, where,
      include: { store: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  count(activeOnly = false) {
    const where: any = {};
    if (activeOnly) {
      where.isActive = true;
      where.startDate = { lte: new Date() };
      where.endDate = { gte: new Date() };
    }
    return prisma.promotion.count({ where });
  },

  findById(id: string) {
    return prisma.promotion.findUnique({ where: { id }, include: { store: { select: { name: true } } } });
  },

  findByCode(code: string) {
    return prisma.promotion.findUnique({ where: { code }, include: { store: { select: { name: true } } } });
  },

  create(data: any) {
    return prisma.promotion.create({ data });
  },

  update(id: string, data: any) {
    return prisma.promotion.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.promotion.delete({ where: { id } });
  },

  incrementUsedCount(id: string) {
    return prisma.promotion.update({ where: { id }, data: { usedCount: { increment: 1 } } });
  },

  findUsage(promotionId: string, memberId: string) {
    return prisma.promotionUsage.findFirst({ where: { promotionId, memberId } });
  },

  createUsage(data: { promotionId: string; memberId: string; orderId: string; discountAmount: number }) {
    return prisma.promotionUsage.create({ data });
  },
};
