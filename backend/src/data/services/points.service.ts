import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";
import { memberService } from "./member.service";

export const pointsService = {
  async earn(memberId: string, points: number, description?: string) {
    if (points <= 0) throw new AppError(400, "Points must be positive");

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new AppError(404, "Member not found");

    await prisma.$transaction([
      prisma.transaction.create({
        data: { memberId, type: "EARN", points, description },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: {
          currentPoints: { increment: points },
          totalPoints: { increment: points },
        },
      }),
    ]);

    await memberService.recalculateTier(memberId);

    return prisma.member.findUnique({ where: { id: memberId } });
  },

  async adjust(memberId: string, points: number, description?: string) {
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new AppError(404, "Member not found");

    if (member.currentPoints + points < 0) {
      throw new AppError(400, "Adjustment would result in negative points");
    }

    await prisma.$transaction([
      prisma.transaction.create({
        data: { memberId, type: "ADJUST", points, description },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: {
          currentPoints: { increment: points },
          ...(points > 0 ? { totalPoints: { increment: points } } : {}),
        },
      }),
    ]);

    await memberService.recalculateTier(memberId);

    return prisma.member.findUnique({ where: { id: memberId } });
  },
};
