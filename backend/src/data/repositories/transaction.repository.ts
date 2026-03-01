import { TransactionType } from "@prisma/client";
import { prisma } from "../prisma";

export const transactionRepository = {
  findAll(skip: number, limit: number, type?: TransactionType, search?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { member: { firstName: { contains: search, mode: "insensitive" } } },
        { member: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }
    return prisma.transaction.findMany({
      skip,
      take: limit,
      where,
      include: { member: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  countAll(type?: TransactionType, search?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { member: { firstName: { contains: search, mode: "insensitive" } } },
        { member: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }
    return prisma.transaction.count({ where });
  },

  findByMemberId(memberId: string, skip: number, limit: number) {
    return prisma.transaction.findMany({
      skip,
      take: limit,
      where: { memberId },
      orderBy: { createdAt: "desc" },
    });
  },

  countByMemberId(memberId: string) {
    return prisma.transaction.count({ where: { memberId } });
  },

  async getHistory(memberId: string, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const transactions = await prisma.transaction.findMany({
      where: { memberId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });
    const grouped: Record<string, { earned: number; spent: number }> = {};
    for (const t of transactions) {
      const date = t.createdAt.toISOString().split("T")[0];
      if (!grouped[date]) grouped[date] = { earned: 0, spent: 0 };
      if (t.points > 0) grouped[date].earned += t.points;
      else grouped[date].spent += Math.abs(t.points);
    }
    return Object.entries(grouped).map(([date, v]) => ({ date, ...v }));
  },
};
