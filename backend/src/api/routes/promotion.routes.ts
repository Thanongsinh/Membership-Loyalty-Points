import { Router } from "express";
import { promotionController } from "../controllers/promotion.controller";
import { authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../../core/utilities/errors";
import { prisma } from "../../data/prisma";

export const promotionRouter = Router();

promotionRouter.get("/", promotionController.getAll);

// Flash sales endpoint - must be before /:id to avoid conflicts
promotionRouter.get("/flash-sales", asyncHandler(async (req, res) => {
  const now = new Date();
  const sales = await prisma.promotion.findMany({
    where: {
      isFlashSale: true,
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: { store: { select: { name: true } } },
    orderBy: { endDate: "asc" },
  });
  res.json(sales);
}));

promotionRouter.get("/:id", promotionController.getById);
promotionRouter.post("/", authorize("ADMIN"), promotionController.create);
promotionRouter.put("/:id", authorize("ADMIN"), promotionController.update);
promotionRouter.delete("/:id", authorize("ADMIN"), promotionController.delete);
promotionRouter.post("/apply", authorize("MEMBER"), promotionController.applyCode);
