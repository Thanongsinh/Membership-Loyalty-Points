import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { prisma } from "../../data/prisma";

export const analyticsController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    const dateFilter = from && to ? { createdAt: { gte: from, lte: to } } : {};

    const [totalMembers, totalTransactions, members, transactions] = await Promise.all([
      prisma.member.count({ where: dateFilter }),
      prisma.transaction.count({ where: dateFilter }),
      prisma.member.findMany({ where: dateFilter, select: { tier: true, totalPoints: true, currentPoints: true } }),
      prisma.transaction.findMany({
        where: dateFilter,
        select: { type: true, points: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const tierCounts = { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 };
    let totalPointsEarned = 0;
    let totalPointsRedeemed = 0;
    for (const m of members) tierCounts[m.tier]++;
    for (const t of transactions) {
      if (t.type === "EARN") totalPointsEarned += t.points;
      if (t.type === "REDEEM") totalPointsRedeemed += Math.abs(t.points);
    }

    // Group transactions by date for chart
    const daily: Record<string, { earned: number; redeemed: number }> = {};
    for (const t of transactions) {
      const day = t.createdAt.toISOString().split("T")[0];
      if (!daily[day]) daily[day] = { earned: 0, redeemed: 0 };
      if (t.type === "EARN") daily[day].earned += t.points;
      if (t.type === "REDEEM") daily[day].redeemed += Math.abs(t.points);
    }

    res.json({
      totalMembers,
      totalTransactions,
      totalPointsEarned,
      totalPointsRedeemed,
      tierCounts,
      dailyChart: Object.entries(daily).map(([date, v]) => ({ date, ...v })),
    });
  }),

  getStoreAnalytics: asyncHandler(async (req: Request<{ storeId: string }>, res: Response) => {
    const storeId = req.params.storeId;
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    const dateFilter: any = { storeId };
    if (from && to) { dateFilter.createdAt = { gte: from, lte: to }; }

    const [totalOrders, completedOrders, revenue, orders, topProducts] = await Promise.all([
      prisma.order.count({ where: dateFilter }),
      prisma.order.count({ where: { ...dateFilter, status: "COMPLETED" } }),
      prisma.order.aggregate({ where: { ...dateFilter, status: "COMPLETED" }, _sum: { totalAmount: true } }),
      prisma.order.findMany({ where: dateFilter, select: { totalAmount: true, createdAt: true, status: true }, orderBy: { createdAt: "asc" } }),
      prisma.orderItem.groupBy({
        by: ["productName"],
        where: { order: dateFilter },
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: "desc" } },
        take: 10,
      }),
    ]);

    const daily: Record<string, { revenue: number; orders: number }> = {};
    for (const o of orders) {
      const day = o.createdAt.toISOString().split("T")[0];
      if (!daily[day]) daily[day] = { revenue: 0, orders: 0 };
      daily[day].orders++;
      if (o.status === "COMPLETED") daily[day].revenue += o.totalAmount;
    }

    res.json({
      totalOrders,
      completedOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
      topProducts: topProducts.map((p) => ({ name: p.productName, quantity: p._sum.quantity, revenue: p._sum.totalPrice })),
      dailyChart: Object.entries(daily).map(([date, v]) => ({ date, ...v })),
    });
  }),

  exportCsv: asyncHandler(async (req: Request, res: Response) => {
    const type = (req.query.type as string) || "transactions";
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    const dateFilter = from && to ? { createdAt: { gte: from, lte: to } } : {};

    if (type === "members") {
      const members = await prisma.member.findMany({
        where: dateFilter,
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
      });
      const header = "ID,Email,First Name,Last Name,Tier,Total Points,Current Points,Created At\n";
      const rows = members.map((m) =>
        `${m.id},${m.user.email},${m.firstName},${m.lastName},${m.tier},${m.totalPoints},${m.currentPoints},${m.createdAt.toISOString()}`
      ).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=members.csv");
      res.send(header + rows);
    } else {
      const transactions = await prisma.transaction.findMany({
        where: dateFilter,
        include: { member: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      });
      const header = "ID,Member,Type,Points,Description,Created At\n";
      const rows = transactions.map((t) =>
        `${t.id},${t.member.firstName} ${t.member.lastName},${t.type},${t.points},"${(t.description || "").replace(/"/g, '""')}",${t.createdAt.toISOString()}`
      ).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
      res.send(header + rows);
    }
  }),
};
