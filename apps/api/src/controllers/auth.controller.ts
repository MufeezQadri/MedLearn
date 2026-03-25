import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
  async signup(req: Request, res: Response) {
    const data = await authService.signup(req.body);
    res.status(201).json({ success: true, data });
  },

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    res.json({ success: true, data });
  },

  async logout(req: Request, res: Response) {
    const data = authService.logout(req.body?.refreshToken);
    res.json({ success: true, data });
  },

  async refresh(req: Request, res: Response) {
    const data = authService.refresh(req.body.refreshToken);
    res.json({ success: true, data });
  },

  async me(req: Request, res: Response) {
    const data = authService.me(req.user!.id);
    res.json({ success: true, data });
  },
};
