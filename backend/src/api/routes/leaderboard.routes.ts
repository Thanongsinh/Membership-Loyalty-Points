import { Router } from "express";
import { authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../../core/utilities/errors";
import { prisma } from "../../data/prisma";

const router = Router();

router.get("/points", asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const members = await prisma.member.findMany({
    take: limit,
    orderBy: { totalPoints: "desc" },
    select: { id: true, firstName: true, lastName: true, totalPoints: true, tier: true, avatarUrl: true },
  });
  res.json(members);
}));

export default router;
