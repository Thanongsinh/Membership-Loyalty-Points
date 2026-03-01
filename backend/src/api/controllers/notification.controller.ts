import { Request, Response } from "express";
import { asyncHandler } from "../../core/utilities/errors";
import { notificationService } from "../../data/services/notification.service";

export const notificationController = {
  getMy: asyncHandler(async (req: Request, res: Response) => {
    const unreadOnly = req.query.unread === "true";
    const notifications = await notificationService.getByUserId(req.user!.userId, unreadOnly);
    res.json(notifications);
  }),

  getUnreadCount: asyncHandler(async (req: Request, res: Response) => {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    res.json({ count });
  }),

  markAsRead: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.userId);
    res.json({ message: "All notifications marked as read" });
  }),

  broadcast: asyncHandler(async (req: Request, res: Response) => {
    const { userIds, type, title, message, data } = req.body;
    await notificationService.broadcast(userIds, type, title, message, data);
    res.json({ message: "Broadcast sent" });
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await notificationService.remove(req.params.id);
    res.json({ message: "Notification deleted" });
  }),
};
