import type { Request, Response } from "express";
import { contentService } from "../services/content.service.js";

export const contentController = {
  async module(req: Request, res: Response) {
    res.json({
      success: true,
      data: await contentService.getModule(req.params.id as string),
    });
  },

  async video(req: Request, res: Response) {
    res.json({
      success: true,
      data: await contentService.getVideo(req.params.id as string),
    });
  },

  async pdf(req: Request, res: Response) {
    res.json({
      success: true,
      data: await contentService.getPdf(req.params.id as string),
    });
  },

  async note(req: Request, res: Response) {
    const data = await contentService.createNote(
      req.user!.id,
      req.body as any,
    );
    res.status(201).json({ success: true, data });
  },
};
