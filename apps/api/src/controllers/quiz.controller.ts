import type { Request, Response } from "express";
import { quizService } from "../services/quiz.service.js";

export const quizController = {
  async list(req: Request, res: Response) {
    res.json({ success: true, data: quizService.getQuizzes() });
  },

  async get(req: Request, res: Response) {
    res.json({ success: true, data: quizService.getQuiz(req.params.id) });
  },

  async start(req: Request, res: Response) {
    res.status(201).json({ success: true, data: quizService.startQuiz(req.user!.id, req.body.quizId) });
  },

  async submit(req: Request, res: Response) {
    res.json({ success: true, data: quizService.submitQuiz(req.user!.id, req.body) });
  },

  async result(req: Request, res: Response) {
    res.json({ success: true, data: quizService.getResult(req.params.id, req.user!.id) });
  },

  async questions(req: Request, res: Response) {
    res.json({
      success: true,
      data: quizService.getQuestions({
        quizId: req.query.quizId as string | undefined,
        subject: req.query.subject as string | undefined,
      }),
    });
  },

  async createQuestion(req: Request, res: Response) {
    res.status(201).json({ success: true, data: quizService.createQuestion(req.body) });
  },

  async history(req: Request, res: Response) {
    res.json({ success: true, data: quizService.getHistory(req.user!.id) });
  },
};
