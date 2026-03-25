import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";

export const usersController = {
  async profile(req: Request, res: Response) {
    res.json({ success: true, data: usersService.getProfile(req.user!.id) });
  },

  async update(req: Request, res: Response) {
    res.json({ success: true, data: usersService.updateUser(req.user!.id, req.body) });
  },

  async progress(req: Request, res: Response) {
    res.json({ success: true, data: usersService.getProgress(req.user!.id) });
  },

  async stats(req: Request, res: Response) {
    res.json({ success: true, data: usersService.getStats(req.user!.id) });
  },
};
