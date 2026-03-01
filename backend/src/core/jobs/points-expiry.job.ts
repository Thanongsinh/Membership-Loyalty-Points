import cron from "node-cron";
import { prisma } from "../../data/prisma";
import { systemSettingService } from "../../data/services/system-setting.service";
import { notificationService } from "../../data/services/notification.service";
import { logger } from "../logs/logger";

export function startPointsExpiryJob() {
  // Run daily at 2:00 AM
  cron.schedule("0 2 * * *", async () => {
    try {
      const expiryDays = await systemSettingService.getNumericValue("points_expiry_days", 365);
      if (expiryDays <= 0) {
        logger.info("Points expiry disabled (0 days)");
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - expiryDays);

      // Find EARN transactions older than expiry that haven't been expired yet
      const expiredTxs = await prisma.transaction.findMany({
        where: {
          type: "EARN",
          createdAt: { lt: cutoffDate },
        },
        include: { member: { include: { user: true } } },
      });

      // Group by member
      const memberPoints: Record<string, { memberId: string; userId: string; total: number }> = {};
      for (const tx of expiredTxs) {
        if (!memberPoints[tx.memberId]) {
          memberPoints[tx.memberId] = { memberId: tx.memberId, userId: tx.member.userId, total: 0 };
        }
        memberPoints[tx.memberId].total += tx.points;
      }

      for (const mp of Object.values(memberPoints)) {
        const member = await prisma.member.findUnique({ where: { id: mp.memberId } });
        if (!member || member.currentPoints <= 0) continue;

        const expireAmount = Math.min(mp.total, member.currentPoints);
        if (expireAmount <= 0) continue;

        await prisma.$transaction([
          prisma.transaction.create({
            data: {
              memberId: mp.memberId,
              type: "EXPIRE",
              points: -expireAmount,
              description: `Points expired (older than ${expiryDays} days)`,
            },
          }),
          prisma.member.update({
            where: { id: mp.memberId },
            data: { currentPoints: { decrement: expireAmount } },
          }),
        ]);

        await notificationService.create({
          userId: mp.userId,
          type: "EXPIRY",
          title: "Points Expired",
          message: `${expireAmount} points have expired.`,
        });

        logger.info(`Expired ${expireAmount} points for member ${mp.memberId}`);
      }
    } catch (err) {
      logger.error(`Points expiry job failed: ${err}`);
    }
  });

  logger.info("Points expiry job scheduled (daily at 2:00 AM)");
}
