import { Router } from "express";
import { progressController } from "../controllers/progress.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { progressUpdateSchema } from "./schemas.js";

export const progressRoutes = Router();

progressRoutes.use(requireAuth);
progressRoutes.get("/", asyncHandler(progressController.get));
progressRoutes.post("/update", validate(progressUpdateSchema), asyncHandler(progressController.update));
progressRoutes.get("/analytics", asyncHandler(progressController.analytics));
