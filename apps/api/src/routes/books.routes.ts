import { Router } from "express";
import { booksController } from "../controllers/books.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { bookSchema } from "./schemas.js";

export const booksRoutes = Router();

booksRoutes.use(requireAuth);
booksRoutes.get("/", asyncHandler(booksController.list));
booksRoutes.get("/search", asyncHandler(booksController.search));
booksRoutes.get("/:id", asyncHandler(booksController.get));
booksRoutes.post("/", requireRole("admin"), validate(bookSchema), asyncHandler(booksController.create));
