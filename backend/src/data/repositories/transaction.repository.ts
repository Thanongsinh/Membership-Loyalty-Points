import { TransactionType } from "@prisma/client";
import { prisma } from "../prisma";

export const transactionRepository = {
  findAll(skip: number, limit: number, type?: TransactionType) {
    return prisma.transaction.findMany({
      skip,
      take: limit,
      where: type ? { type } : undefined,
      include: { member: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  countAll(type?: TransactionType) {
    return prisma.transaction.count({
      where: type ? { type } : undefined,
    });
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
};
