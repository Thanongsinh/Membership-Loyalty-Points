import { Router } from "express";
import { gamificationController } from "../controllers/gamification.controller";

const router = Router();

router.post("/check-in", gamificationController.checkIn);
router.get("/badges", gamificationController.getBadges);
router.get("/badges/all", gamificationController.getBadgeDefinitions);

export default router;
