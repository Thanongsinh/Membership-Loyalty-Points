import { Tier } from "@prisma/client";
import { prisma } from "../prisma";

export const memberRepository = {
  findAll(skip: number, limit: number) {
    return prisma.member.findMany({
      skip,
      take: limit,
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  count() {
    return prisma.member.count();
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
