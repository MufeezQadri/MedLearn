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
    res.json({
      success: true,
      data: await coursesService.getCourse(req.params.id as string),
    });
  },

  async create(req: Request, res: Response) {
    const data = await coursesService.createCourse(req.body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const data = await coursesService.updateCourse(
      req.params.id as string,
      req.body,
    );
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response) {
    const data = await coursesService.deleteCourse(req.params.id as string);
    res.json({ success: true, data });
  },

  async enroll(req: Request, res: Response) {
    const data = await coursesService.enrollCourse(
      req.params.id as string,
      req.user!.id,
    );
    res.status(201).json({ success: true, data });
  },
};
