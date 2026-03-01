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
};
