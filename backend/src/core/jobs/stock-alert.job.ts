import cron from "node-cron";
import { prisma } from "../../data/prisma";
import { systemSettingService } from "../../data/services/system-setting.service";
import { notificationService } from "../../data/services/notification.service";
import { logger } from "../logs/logger";

export function startStockAlertJob() {
  // Run daily at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    try {
      const threshold = await systemSettingService.getNumericValue("low_stock_threshold", 5);

      const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lte: threshold }, isActive: true },
        include: { store: { include: { staff: true } } },
      });

      if (!lowStockProducts.length) return;

      // Notify admins
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
      const adminIds = admins.map((a) => a.id);

      for (const product of lowStockProducts) {
        const staffUserIds = product.store.staff.map((s) => s.userId);
        const notifyIds = [...new Set([...adminIds, ...staffUserIds])];

        await notificationService.broadcast(
          notifyIds,
          "STOCK" as any,
          "Low Stock Alert",
          `"${product.name}" at ${product.store.name} has only ${product.stock} left.`,
          { productId: product.id, storeId: product.storeId },
        );
      }

      logger.info(`Stock alert: ${lowStockProducts.length} products with low stock`);
    } catch (err) {
      logger.error(`Stock alert job failed: ${err}`);
    }
  });

  logger.info("Stock alert job scheduled (daily at 6:00 AM)");
}
