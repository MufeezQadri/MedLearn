import { Router } from "express";
import { coursesController } from "../controllers/courses.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { courseSchema, updateCourseSchema } from "./schemas.js";

export const coursesRoutes = Router();

coursesRoutes.get("/", requireAuth, asyncHandler(coursesController.list));
coursesRoutes.get("/:id", requireAuth, asyncHandler(coursesController.get));
coursesRoutes.post("/", requireAuth, requireRole("admin"), validate(courseSchema), asyncHandler(coursesController.create));
coursesRoutes.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateCourseSchema),
  asyncHandler(coursesController.update),
);
coursesRoutes.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(coursesController.remove));
coursesRoutes.post("/:id/enroll", requireAuth, asyncHandler(coursesController.enroll));
