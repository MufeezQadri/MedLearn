import type { Request, Response } from "express";
import { contentService } from "../services/content.service.js";

export const contentController = {
  async module(req: Request, res: Response) {
    res.json({ success: true, data: contentService.getModule(req.params.id) });
  },

  async video(req: Request, res: Response) {
    res.json({ success: true, data: contentService.getVideo(req.params.id) });
  },

  async pdf(req: Request, res: Response) {
    res.json({ success: true, data: contentService.getPdf(req.params.id) });
  },

  async note(req: Request, res: Response) {
    const data = contentService.createNote(req.user!.id, req.body);
    res.status(201).json({ success: true, data });
  },
};
