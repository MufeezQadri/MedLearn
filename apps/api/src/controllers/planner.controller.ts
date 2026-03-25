import type { Request, Response } from "express";
import { plannerService } from "../services/planner.service.js";

export const plannerController = {
  async get(req: Request, res: Response) {
    res.json({ success: true, data: plannerService.getPlanner(req.user!.id) });
  },

  async createTask(req: Request, res: Response) {
    res.status(201).json({ success: true, data: plannerService.createTask(req.user!.id, req.body) });
  },

  async deleteTask(req: Request, res: Response) {
    res.json({ success: true, data: plannerService.deleteTask(req.user!.id, req.params.id) });
  },
};
