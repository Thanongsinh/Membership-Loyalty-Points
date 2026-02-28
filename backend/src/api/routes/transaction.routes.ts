import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { authorize } from "../middleware/auth.middleware";

export const transactionRouter = Router();

transactionRouter.get("/me", authorize("MEMBER"), transactionController.getMy);
transactionRouter.get("/", authorize("ADMIN", "STAFF"), transactionController.getAll);
