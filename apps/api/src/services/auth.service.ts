import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/db.js";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
import { AppError } from "../lib/http-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";

// Basic in-memory refresh token store since redis might not be running
const refreshTokens = new Set<string>();

interface AuthPayload {
  email: string;
  password: string;
}

const issueTokens = (user: any): AuthTokens => {
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
  async signup(payload: AuthPayload & { fullName: string; examTrack: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() }
    });

    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email.toLowerCase(),
        passwordHash,
        role: "student",
        examTrack: payload.examTrack,
        streakDays: 1,
      }
    });

    // Remove password hash before returning
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: { ...userWithoutPassword, weakTopics: [], strongTopics: [] },
      tokens: issueTokens(user),
    };
  },

  async login(payload: AuthPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() }
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(payload.password, user.passwordHash);

    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: { ...userWithoutPassword, weakTopics: [], strongTopics: [] },
      tokens: issueTokens(user),
    };
  },

  logout(refreshToken?: string) {
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }
    return { loggedOut: true };
  },

  async refresh(refreshToken: string) {
    if (!refreshTokens.has(refreshToken)) {
      throw new AppError("Refresh token has been revoked", 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    refreshTokens.delete(refreshToken);
    
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: { ...userWithoutPassword, weakTopics: [], strongTopics: [] },
      tokens: issueTokens(user),
    };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, weakTopics: [], strongTopics: [] };
  },
};
