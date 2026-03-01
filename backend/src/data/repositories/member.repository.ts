import { Tier } from "@prisma/client";
import { prisma } from "../prisma";

export const memberRepository = {
  findAll(skip: number, limit: number, search?: string, tier?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (tier) where.tier = tier;
    return prisma.member.findMany({
      skip,
      take: limit,
      where,
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  count(search?: string, tier?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (tier) where.tier = tier;
    return prisma.member.count({ where });
  },

  findById(id: string) {
    return prisma.member.findUnique({
      where: { id },
      include: { user: { select: { email: true, role: true } } },
    });
  },

  findByUserId(userId: string) {
    return prisma.member.findUnique({
      where: { userId },
      include: { user: { select: { email: true, role: true } } },
    });
  },

  update(id: string, data: { firstName?: string; lastName?: string; phone?: string; tier?: Tier; totalPoints?: number; currentPoints?: number }) {
    return prisma.member.update({ where: { id }, data });
  },
};
