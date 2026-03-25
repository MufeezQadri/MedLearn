import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { questionSchema, startQuizSchema, submitQuizSchema } from "./schemas.js";

export const quizRoutes = Router();

quizRoutes.use(requireAuth);
quizRoutes.get("/", asyncHandler(quizController.list));
quizRoutes.get("/history", asyncHandler(quizController.history));
quizRoutes.get("/result/:id", asyncHandler(quizController.result));
quizRoutes.post("/start", validate(startQuizSchema), asyncHandler(quizController.start));
quizRoutes.post("/submit", validate(submitQuizSchema), asyncHandler(quizController.submit));
quizRoutes.get("/:id", asyncHandler(quizController.get));

export const questionRoutes = Router();

questionRoutes.use(requireAuth);
questionRoutes.get("/", asyncHandler(quizController.questions));
questionRoutes.post("/", requireRole("admin"), validate(questionSchema), asyncHandler(quizController.createQuestion));
