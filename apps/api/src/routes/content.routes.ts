import { Router } from "express";
import { contentController } from "../controllers/content.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { noteSchema } from "./schemas.js";

export const contentRoutes = Router();

contentRoutes.get("/modules/:id", requireAuth, asyncHandler(contentController.module));
contentRoutes.get("/videos/:id", requireAuth, asyncHandler(contentController.video));
contentRoutes.get("/pdfs/:id", requireAuth, asyncHandler(contentController.pdf));
contentRoutes.post("/notes", requireAuth, validate(noteSchema), asyncHandler(contentController.note));
