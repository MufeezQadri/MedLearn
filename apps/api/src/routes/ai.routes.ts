import { Router } from "express";
import { aiController } from "../controllers/ai.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { aiChatSchema, analyzePerformanceSchema } from "./schemas.js";

export const aiRoutes = Router();

aiRoutes.use(requireAuth);
aiRoutes.post("/chat", validate(aiChatSchema), asyncHandler(aiController.chat));
aiRoutes.get("/recommendations", asyncHandler(aiController.recommendations));
aiRoutes.post(
  "/analyze-performance",
  validate(analyzePerformanceSchema),
  asyncHandler(aiController.analyzePerformance),
);
