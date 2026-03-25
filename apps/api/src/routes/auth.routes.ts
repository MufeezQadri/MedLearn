import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, refreshSchema, signupSchema } from "./schemas.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimit, validate(signupSchema), asyncHandler(authController.signup));
authRoutes.post("/login", authRateLimit, validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/logout", asyncHandler(authController.logout));
authRoutes.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));
