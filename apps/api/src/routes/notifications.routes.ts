import { Router } from "express";
import { notificationsController } from "../controllers/notifications.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { notificationSchema } from "./schemas.js";

export const notificationsRoutes = Router();

notificationsRoutes.use(requireAuth);
notificationsRoutes.get("/", asyncHandler(notificationsController.list));
notificationsRoutes.post("/", validate(notificationSchema), asyncHandler(notificationsController.create));
