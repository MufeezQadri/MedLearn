import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { AuthTokens, User } from "@medlearn/shared";
import { state, passwordHashes, refreshTokens } from "../data/store.js";
import { AppError } from "../lib/http-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";

interface AuthPayload {
  email: string;
  password: string;
}

const issueTokens = (user: User): AuthTokens => {
  const claims = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(claims);
  const refreshToken = signRefreshToken(claims);
  refreshTokens.add(refreshToken);

  return { accessToken, refreshToken };
};

export const authService = {
  async signup(payload: AuthPayload & { fullName: string; examTrack: User["examTrack"] }) {
    const existing = state.users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());

    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const user: User = {
      id: uuidv4(),
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      role: "student",
      examTrack: payload.examTrack,
      streakDays: 1,
      weakTopics: [],
      strongTopics: [],
      createdAt: new Date().toISOString(),
    };

    state.users.push(user);
    state.progressSnapshots.push({
      userId: user.id,
      completedCourses: 0,
      completionPercent: 0,
      hoursLearned: 0,
      quizzesTaken: 0,
      averageAccuracy: 0,
      weakTopics: [],
      strongTopics: [],
    });

    passwordHashes.set(user.email, await bcrypt.hash(payload.password, 10));

    return {
      user,
      tokens: issueTokens(user),
    };
  },

  async login(payload: AuthPayload) {
    const user = state.users.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const hash = passwordHashes.get(user.email);
    const valid = hash ? await bcrypt.compare(payload.password, hash) : false;

    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      user,
      tokens: issueTokens(user),
    };
  },

  logout(refreshToken?: string) {
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    return { loggedOut: true };
  },

  refresh(refreshToken: string) {
    if (!refreshTokens.has(refreshToken)) {
      throw new AppError("Refresh token has been revoked", 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = state.users.find((item) => item.id === payload.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    refreshTokens.delete(refreshToken);

    return {
      user,
      tokens: issueTokens(user),
    };
  },

  me(userId: string) {
    const user = state.users.find((item) => item.id === userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },
};
