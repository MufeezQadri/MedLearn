import type { Request, Response } from "express";
import { progressService } from "../services/progress.service.js";

export const progressController = {
  async get(req: Request, res: Response) {
    res.json({ success: true, data: progressService.getProgress(req.user!.id) });
  },

  async update(req: Request, res: Response) {
    res.json({ success: true, data: progressService.updateProgress(req.user!.id, req.body) });
  },

  async analytics(req: Request, res: Response) {
    res.json({ success: true, data: progressService.getAnalytics(req.user!.id) });
  },
};
