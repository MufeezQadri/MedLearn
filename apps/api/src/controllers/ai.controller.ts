import type { Request, Response } from "express";
import { aiService } from "../services/ai.service.js";

export const aiController = {
  async chat(req: Request, res: Response) {
    const data = await aiService.chat(req.user!.id, req.body.prompt);
    res.json({ success: true, data });
  },

  async recommendations(req: Request, res: Response) {
    const data = await aiService.getRecommendations(req.user!.id);
    res.json({ success: true, data });
  },

  async analyzePerformance(req: Request, res: Response) {
    const data = await aiService.analyzePerformance(req.user!.id, req.body);
    res.json({ success: true, data });
  },
};
