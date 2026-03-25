import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface JwtUser {
  id: string;
  email: string;
  role: string;
}

export const signAccessToken = (user: JwtUser) =>
  jwt.sign(user, env.JWT_SECRET, {
    expiresIn: "30m",
    subject: user.id,
  });

export const signRefreshToken = (user: JwtUser) =>
  jwt.sign(user, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    subject: user.id,
  });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as JwtUser;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtUser;
