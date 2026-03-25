import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateUserSchema } from "./schemas.js";

export const usersRoutes = Router();

usersRoutes.use(requireAuth);
usersRoutes.get("/profile", asyncHandler(usersController.profile));
usersRoutes.put("/update", validate(updateUserSchema), asyncHandler(usersController.update));
usersRoutes.get("/progress", asyncHandler(usersController.progress));
usersRoutes.get("/stats", asyncHandler(usersController.stats));
