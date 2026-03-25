import { analyticsInsights } from "@medlearn/shared";
import { state } from "../data/store.js";

export const progressService = {
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

  updateProgress(
    userId: string,
    payload: Partial<{ courseId: string; moduleId: string; completionPercent: number; hoursLearned: number }>,
  ) {
    const snapshot = this.getProgress(userId);
    const existing = state.progressSnapshots.find((item) => item.userId === userId);

    snapshot.completionPercent = payload.completionPercent ?? snapshot.completionPercent;
    snapshot.hoursLearned += payload.hoursLearned ?? 0;

    if (payload.moduleId) {
      const module = state.modules.find((item) => item.id === payload.moduleId);

      if (module && typeof payload.completionPercent === "number") {
        module.completionPercent = payload.completionPercent;
      }
    }

    if (!existing) {
      state.progressSnapshots.push(snapshot);
    }

    return snapshot;
  },

  getAnalytics(userId: string) {
    const progress = this.getProgress(userId);
    const attempts = state.quizAttempts.filter((item) => item.userId === userId && item.status === "submitted");
    const recent = attempts.slice(0, 5);

    return {
      progress,
      analytics: analyticsInsights,
      recentAttempts: recent,
      weakVsStrong: {
        weakTopics: progress.weakTopics,
        strongTopics: progress.strongTopics,
      },
    };
  },
};
