import type { Request, Response } from "express";
import { notificationsService } from "../services/notifications.service.js";

export const notificationsController = {
  async list(req: Request, res: Response) {
    res.json({ success: true, data: notificationsService.getNotifications(req.user!.id) });
  },

  async create(req: Request, res: Response) {
    res.status(201).json({ success: true, data: notificationsService.createNotification(req.user!.id, req.body) });
  },
};
