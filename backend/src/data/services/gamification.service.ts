import { prisma } from "../prisma";
import { AppError } from "../../core/utilities/errors";
import { pointsService } from "./points.service";
import { notificationService } from "./notification.service";
import { systemSettingService } from "./system-setting.service";

// Badge definitions
const BADGES = [
  { key: "first_purchase", name: "First Purchase", description: "Made your first redemption", icon: "🛒" },
  { key: "points_1000", name: "Point Collector", description: "Earned 1,000 total points", icon: "💰" },
  { key: "points_5000", name: "Point Master", description: "Earned 5,000 total points", icon: "🏆" },
  { key: "points_20000", name: "Point Legend", description: "Earned 20,000 total points", icon: "👑" },
  { key: "referral_1", name: "Connector", description: "Referred 1 friend", icon: "🤝" },
  { key: "referral_5", name: "Ambassador", description: "Referred 5 friends", icon: "🌟" },
  { key: "streak_7", name: "Weekly Warrior", description: "7-day check-in streak", icon: "🔥" },
  { key: "streak_30", name: "Monthly Champion", description: "30-day check-in streak", icon: "⚡" },
];

export const gamificationService = {
  getBadgeDefinitions() {
    return BADGES;
  },

  async checkIn(userId: string) {
    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) throw new AppError(404, "Member not found");

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.transaction.findFirst({
      where: {
        memberId: member.id,
        type: "EARN",
        description: { startsWith: "Daily check-in" },
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    if (existing) throw new AppError(409, "Already checked in today");

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCheckIn = await prisma.transaction.findFirst({
      where: {
        memberId: member.id,
        type: "EARN",
        description: { startsWith: "Daily check-in" },
        createdAt: { gte: yesterday, lt: today },
      },
    });

    // Get current streak from description pattern "Daily check-in (Day X)"
    let streak = 1;
    if (yesterdayCheckIn) {
      const match = yesterdayCheckIn.description?.match(/Day (\d+)/);
      streak = match ? parseInt(match[1]) + 1 : 2;
    }

    const checkInPoints = await systemSettingService.getNumericValue("daily_checkin_points", 10);
    const bonusPoints = streak % 7 === 0 ? checkInPoints * 2 : 0; // Double on every 7th day
    const totalPoints = checkInPoints + bonusPoints;

    await pointsService.earn(member.id, totalPoints, `Daily check-in (Day ${streak})${bonusPoints > 0 ? " - Streak bonus!" : ""}`);

    // Check streak badges
    const earnedBadges: string[] = [];
    if (streak >= 7) earnedBadges.push("streak_7");
    if (streak >= 30) earnedBadges.push("streak_30");

    return { streak, points: totalPoints, bonusPoints, earnedBadges };
  },

  async getMemberBadges(userId: string) {
    const member = await prisma.member.findUnique({
      where: { userId },
      include: { transactions: true, redemptions: true, referralsMade: true },
    });
    if (!member) throw new AppError(404, "Member not found");

    const earned: string[] = [];

    // Points badges
    if (member.totalPoints >= 1000) earned.push("points_1000");
    if (member.totalPoints >= 5000) earned.push("points_5000");
    if (member.totalPoints >= 20000) earned.push("points_20000");

    // First purchase
    if (member.redemptions.length > 0) earned.push("first_purchase");

    // Referral badges
    const referralCount = member.referralsMade.length;
    if (referralCount >= 1) earned.push("referral_1");
    if (referralCount >= 5) earned.push("referral_5");

    // Streak badges - check transaction history
    const checkIns = member.transactions.filter((t) => t.description?.startsWith("Daily check-in"));
    const maxStreak = checkIns.reduce((max, t) => {
      const match = t.description?.match(/Day (\d+)/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    if (maxStreak >= 7) earned.push("streak_7");
    if (maxStreak >= 30) earned.push("streak_30");

    return BADGES.map((b) => ({ ...b, earned: earned.includes(b.key) }));
  },
};
