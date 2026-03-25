import type { NextFunction, Request, Response } from "express";
import type { Role } from "@medlearn/shared";
import { AppError } from "../lib/http-error.js";
import { verifyAccessToken } from "../lib/jwt.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Authorization token missing", 401));
    return;
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role as Role,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError("Insufficient permissions", 403));
      return;
    }

    next();
  };
