import { analyticsInsights } from "@medlearn/shared";
import { state } from "../data/store.js";
import { getUserOrThrow } from "./helpers.js";

export const usersService = {
  getProfile(userId: string) {
    return getUserOrThrow(userId);
  },

  updateUser(userId: string, updates: Partial<{ fullName: string; avatarUrl: string; examTrack: string }>) {
    const user = getUserOrThrow(userId);

    Object.assign(user, updates);

    return user;
  },

  getProgress(userId: string) {
    return (
      state.progressSnapshots.find((item) => item.userId === userId) ?? {
        userId,
        completedCourses: 0,
        completionPercent: 0,
        hoursLearned: 0,
        quizzesTaken: 0,
        averageAccuracy: 0,
        weakTopics: [],
        strongTopics: [],
      }
    );
  },

  getStats(userId: string) {
    const user = getUserOrThrow(userId);
    const progress = this.getProgress(userId);
    const attempts = state.quizAttempts.filter((item) => item.userId === userId && item.status === "submitted");

    return {
      user,
      progress,
      analytics: analyticsInsights,
      stats: {
        streakDays: user.streakDays,
        quizzesTaken: attempts.length,
        averageAccuracy: progress.averageAccuracy,
        enrolledCourses: state.courses.length,
      },
    };
  },
};
