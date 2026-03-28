import type { Request, Response } from "express";
import { quizService } from "../services/quiz.service.js";

export const quizController = {
  async list(_req: Request, res: Response) {
    const data = await quizService.getQuizzes();
    res.json({ success: true, data });
  },

  async get(req: Request, res: Response) {
    const data = await quizService.getQuiz(req.params.id);
    res.json({ success: true, data });
  },

  async start(req: Request, res: Response) {
    const data = await quizService.startQuiz(req.user!.id, req.body.quizId);
    res.status(201).json({ success: true, data });
  },

  async submit(req: Request, res: Response) {
    const data = await quizService.submitQuiz(req.user!.id, req.body);
    res.json({ success: true, data });
  },

  async result(req: Request, res: Response) {
    const data = await quizService.getResult(req.params.id, req.user!.id);
    res.json({ success: true, data });
  },

  async questions(req: Request, res: Response) {
    const data = await quizService.getQuestions({
      quizId: req.query.quizId as string | undefined,
      subject: req.query.subject as string | undefined,
    });
    res.json({ success: true, data });
  },

  async createQuestion(req: Request, res: Response) {
    const data = await quizService.createQuestion(req.body);
    res.status(201).json({ success: true, data });
  },

  async history(req: Request, res: Response) {
    const data = await quizService.getHistory(req.user!.id);
    res.json({ success: true, data });
  },
};
