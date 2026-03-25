import { AppError } from "../lib/http-error.js";
import { state } from "../data/store.js";

export const getUserOrThrow = (userId: string) => {
  const user = state.users.find((item) => item.id === userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getCourseOrThrow = (courseId: string) => {
  const course = state.courses.find((item) => item.id === courseId || item.slug === courseId);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

export const getQuizOrThrow = (quizId: string) => {
  const quiz = state.quizzes.find((item) => item.id === quizId);

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  return quiz;
};

export const getAttemptOrThrow = (attemptId: string) => {
  const attempt = state.quizAttempts.find((item) => item.id === attemptId);

  if (!attempt) {
    throw new AppError("Quiz attempt not found", 404);
  }

  return attempt;
};
