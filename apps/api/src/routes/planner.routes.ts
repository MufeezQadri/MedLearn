import { Router } from "express";
import { plannerController } from "../controllers/planner.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { taskSchema } from "./schemas.js";

export const plannerRoutes = Router();

plannerRoutes.use(requireAuth);
plannerRoutes.get("/", asyncHandler(plannerController.get));
plannerRoutes.post("/task", validate(taskSchema), asyncHandler(plannerController.createTask));
plannerRoutes.delete("/task/:id", asyncHandler(plannerController.deleteTask));
