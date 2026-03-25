import type { Request, Response } from "express";
import { aiService } from "../services/ai.service.js";

export const aiController = {
  async chat(req: Request, res: Response) {
    res.json({ success: true, data: aiService.chat(req.user!.id, req.body.prompt) });
  },

  async recommendations(req: Request, res: Response) {
    res.json({ success: true, data: aiService.getRecommendations(req.user!.id) });
  },

  async analyzePerformance(req: Request, res: Response) {
    res.json({ success: true, data: aiService.analyzePerformance(req.user!.id, req.body) });
  },
};
