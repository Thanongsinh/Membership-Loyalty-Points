import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authorize } from "../middleware/auth.middleware";

export const reviewRouter = Router();

reviewRouter.get("/product/:productId", reviewController.getByProduct);
reviewRouter.post("/", authorize("MEMBER"), reviewController.create);
