import { Router } from "express";
import { quizController } from "../controllers/quiz.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { questionSchema, startQuizSchema, submitQuizSchema } from "./schemas.js";

export const quizRoutes = Router();

// Public reads — the app can show the quiz catalog without login
quizRoutes.get("/", asyncHandler(quizController.list));
quizRoutes.get("/:id", asyncHandler(quizController.get));

// Auth-required actions
quizRoutes.get("/history", requireAuth, asyncHandler(quizController.history));
quizRoutes.get("/result/:id", requireAuth, asyncHandler(quizController.result));
quizRoutes.post("/start", requireAuth, validate(startQuizSchema), asyncHandler(quizController.start));
quizRoutes.post("/submit", requireAuth, validate(submitQuizSchema), asyncHandler(quizController.submit));

export const questionRoutes = Router();

questionRoutes.get("/", asyncHandler(quizController.questions));
questionRoutes.post("/", requireAuth, requireRole("admin"), validate(questionSchema), asyncHandler(quizController.createQuestion));
