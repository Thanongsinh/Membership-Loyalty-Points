import { prisma } from "../prisma";

export const rewardRepository = {
  findAll(skip: number, limit: number, activeOnly = false) {
    return prisma.reward.findMany({
      skip,
      take: limit,
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
    });
  },

  count(activeOnly = false) {
    return prisma.reward.count({
      where: activeOnly ? { isActive: true } : undefined,
    });
  },

  findById(id: string) {
    return prisma.reward.findUnique({ where: { id } });
  },

  create(data: { name: string; description?: string; pointsCost: number; stock: number; imageUrl?: string }) {
    return prisma.reward.create({ data });
  },

  update(id: string, data: { name?: string; description?: string; pointsCost?: number; stock?: number; imageUrl?: string; isActive?: boolean }) {
    return prisma.reward.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.reward.delete({ where: { id } });
  },
};
