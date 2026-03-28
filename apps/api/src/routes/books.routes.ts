import { Router } from "express";
import { booksController } from "../controllers/books.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { bookSchema } from "./schemas.js";

export const booksRoutes = Router();

// Public reads — students can browse books even without login
booksRoutes.get("/", asyncHandler(booksController.list));
booksRoutes.get("/search", asyncHandler(booksController.search));
booksRoutes.get("/:id", asyncHandler(booksController.get));

// Admin-only writes — fully secured
booksRoutes.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate(bookSchema),
  asyncHandler(booksController.create),
);
