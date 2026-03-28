import { Router } from "express";
import { coursesController } from "../controllers/courses.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { courseSchema, updateCourseSchema } from "./schemas.js";

export const coursesRoutes = Router();

// Public reads — the Flutter mobile app fetches these without auth for the MVP
coursesRoutes.get("/", asyncHandler(coursesController.list));
coursesRoutes.get("/:id", asyncHandler(coursesController.get));

// Admin-only mutations — fully secured
coursesRoutes.post("/", requireAuth, requireRole("admin"), validate(courseSchema), asyncHandler(coursesController.create));
coursesRoutes.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateCourseSchema),
  asyncHandler(coursesController.update),
);
coursesRoutes.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(coursesController.remove));

// Enroll requires user identity
coursesRoutes.post("/:id/enroll", requireAuth, asyncHandler(coursesController.enroll));
