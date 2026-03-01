import { prisma } from "../prisma";
import { NotificationType } from "@prisma/client";

export const notificationService = {
  async getByUserId(userId: string, onlyUnread = false) {
    const where: any = { userId };
    if (onlyUnread) where.isRead = false;
    return prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 });
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  async create(data: { userId: string; type: NotificationType; title: string; message: string; data?: any }) {
    return prisma.notification.create({ data });
  },

  async broadcast(userIds: string[], type: NotificationType, title: string, message: string, data?: any) {
    return prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, type, title, message, data })),
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },

  async remove(id: string) {
    return prisma.notification.delete({ where: { id } });
  },

  // Helper: notify member about tier upgrade
  async notifyTierUpgrade(userId: string, newTier: string) {
    return this.create({
      userId,
      type: "TIER",
      title: "Tier Upgraded!",
      message: `Congratulations! You've been upgraded to ${newTier} tier.`,
      data: { tier: newTier },
    });
  },

  // Helper: notify member about points earned
  async notifyPointsEarned(userId: string, points: number, description?: string) {
    return this.create({
      userId,
      type: "POINTS",
      title: "Points Earned",
      message: `You earned ${points} points${description ? `: ${description}` : ""}.`,
      data: { points },
    });
  },

  // Helper: notify about new reward
  async notifyNewReward(userIds: string[], rewardName: string) {
    return this.broadcast(userIds, "REWARD", "New Reward Available", `Check out the new reward: ${rewardName}!`);
  },
};
