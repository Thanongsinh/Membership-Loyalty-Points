import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";
import { pointsService } from "./points.service";
import { notificationService } from "./notification.service";
import { systemSettingService } from "./system-setting.service";

export const referralService = {
  async getReferralCode(userId: string): Promise<string> {
    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) throw new AppError(404, "Member not found");
    return member.referralCode;
  },

  async applyReferral(referredUserId: string, referralCode: string) {
    const referrer = await prisma.member.findUnique({ where: { referralCode } });
    if (!referrer) throw new AppError(404, "Invalid referral code");

    const referred = await prisma.member.findUnique({ where: { userId: referredUserId } });
    if (!referred) throw new AppError(404, "Member not found");

    if (referrer.id === referred.id) throw new AppError(400, "Cannot refer yourself");

    const existing = await prisma.referral.findFirst({
      where: { referredId: referred.id },
    });
    if (existing) throw new AppError(409, "You have already used a referral code");

    const referrerBonus = await systemSettingService.getNumericValue("referral_referrer_bonus", 200);
    const referredBonus = await systemSettingService.getNumericValue("referral_referred_bonus", 100);

    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referred.id,
        status: "COMPLETED",
        referrerBonus,
        referredBonus,
        completedAt: new Date(),
      },
    });

    // Award bonus points
    await pointsService.earn(referrer.id, referrerBonus, `Referral bonus: invited ${referred.firstName}`);
    await pointsService.earn(referred.id, referredBonus, `Referral bonus: joined via ${referrer.firstName}`);

    // Notify
    await notificationService.create({
      userId: referrer.userId,
      type: "POINTS",
      title: "Referral Bonus!",
      message: `${referred.firstName} joined using your code! You earned ${referrerBonus} points.`,
    });

    return referral;
  },

  async getMyReferrals(userId: string) {
    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) throw new AppError(404, "Member not found");

    return prisma.referral.findMany({
      where: { referrerId: member.id },
      include: { referred: { select: { firstName: true, lastName: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getAllReferrals() {
    return prisma.referral.findMany({
      include: {
        referrer: { select: { firstName: true, lastName: true } },
        referred: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
