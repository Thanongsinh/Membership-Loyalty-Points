import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", notificationController.getMy);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);
router.post("/broadcast", authorize("ADMIN"), notificationController.broadcast);
router.delete("/:id", notificationController.remove);

export default router;
