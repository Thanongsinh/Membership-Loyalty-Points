import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";
import { memberService } from "./member.service";
import { campaignService } from "./campaign.service";
import { notificationService } from "./notification.service";

export const pointsService = {
  async earn(memberId: string, points: number, description?: string) {
    if (points <= 0) throw new AppError(400, "Points must be positive");

    const member = await prisma.member.findUnique({ where: { id: memberId }, include: { user: true } });
    if (!member) throw new AppError(404, "Member not found");

    // Apply campaign multiplier & bonus
    const multiplier = await campaignService.getActiveMultiplier();
    const bonus = await campaignService.getActiveBonusPoints();
    const finalPoints = Math.floor(points * multiplier) + bonus;

    const campaignNote = multiplier > 1 || bonus > 0
      ? ` (x${multiplier} multiplier${bonus > 0 ? ` +${bonus} bonus` : ""})`
      : "";

    await prisma.$transaction([
      prisma.transaction.create({
        data: { memberId, type: "EARN", points: finalPoints, description: (description || "Points earned") + campaignNote },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: {
          currentPoints: { increment: finalPoints },
          totalPoints: { increment: finalPoints },
        },
      }),
    ]);

    const oldTier = member.tier;
    await memberService.recalculateTier(memberId);
    const updated = await prisma.member.findUnique({ where: { id: memberId } });

    // Notify member
    await notificationService.notifyPointsEarned(member.userId, finalPoints, description);
    if (updated && updated.tier !== oldTier) {
      await notificationService.notifyTierUpgrade(member.userId, updated.tier);
    }

    return updated;
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
