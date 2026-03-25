import type { Request, Response } from "express";
import { coursesService } from "../services/courses.service.js";

export const coursesController = {
  async list(req: Request, res: Response) {
    const data = await coursesService.getCourses({
      subject: req.query.subject as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json({ success: true, data });
  },

  async get(req: Request, res: Response) {
    res.json({ success: true, data: coursesService.getCourse(req.params.id) });
  },

  async create(req: Request, res: Response) {
    const data = await coursesService.createCourse(req.body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const data = await coursesService.updateCourse(req.params.id, req.body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response) {
    const data = await coursesService.deleteCourse(req.params.id);
    res.json({ success: true, data });
  },

  async enroll(req: Request, res: Response) {
    res.status(201).json({
      success: true,
      data: coursesService.enrollCourse(req.params.id, req.user!.id),
    });
  },
};
