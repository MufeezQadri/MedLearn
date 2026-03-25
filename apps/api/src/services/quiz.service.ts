import { v4 as uuidv4 } from "uuid";
import type { QuizAnswer, QuizResultPayload } from "@medlearn/shared";
import { state } from "../data/store.js";
import { AppError } from "../lib/http-error.js";
import { getAttemptOrThrow, getQuizOrThrow } from "./helpers.js";

const round = (value: number) => Math.round(value * 100) / 100;

const buildTopicBreakdown = (quizId: string, answers: QuizAnswer[]) => {
  const relatedQuestions = state.questions.filter((item) => item.quizId === quizId);
  const scoreByTopic = new Map<string, { correct: number; total: number }>();

  relatedQuestions.forEach((question) => {
    const bucket = scoreByTopic.get(question.topic) ?? { correct: 0, total: 0 };
    const answer = answers.find((item) => item.questionId === question.id);

    if (answer?.optionId === question.correctOptionId) {
      bucket.correct += 1;
    }

    bucket.total += 1;
    scoreByTopic.set(question.topic, bucket);
  });

  const entries = [...scoreByTopic.entries()].map(([topic, stats]) => ({
    topic,
    accuracy: stats.total === 0 ? 0 : (stats.correct / stats.total) * 100,
  }));

  return {
    weakTopics: entries.filter((item) => item.accuracy < 70).map((item) => item.topic),
    strongTopics: entries.filter((item) => item.accuracy >= 85).map((item) => item.topic),
  };
};

const buildAttemptAnswers = (quizId: string): QuizAnswer[] =>
  state.questions
    .filter((item) => item.quizId === quizId)
    .map((question) => ({
      questionId: question.id,
      markedForReview: false,
      eliminatedOptionIds: [],
    }));

export const quizService = {
  getQuizzes() {
    return state.quizzes.map((quiz) => ({
      ...quiz,
      latestAttempt: state.quizAttempts
        .filter((attempt) => attempt.quizId === quiz.id)
        .sort((left, right) => right.startedAt.localeCompare(left.startedAt))[0] ?? null,
    }));
  },

  getQuiz(quizId: string) {
    const quiz = getQuizOrThrow(quizId);

    return {
      ...quiz,
      questions: state.questions.filter((item) => item.quizId === quiz.id),
    };
  },

  startQuiz(userId: string, quizId: string) {
    const quiz = getQuizOrThrow(quizId);
    const currentAttempt = state.quizAttempts.find(
      (item) => item.quizId === quizId && item.userId === userId && item.status === "in_progress",
    );

    if (currentAttempt) {
      return {
        attempt: currentAttempt,
        quiz,
        questions: state.questions.filter((item) => item.quizId === quiz.id),
      };
    }

    const attempt = {
      id: uuidv4(),
      quizId,
      userId,
      status: "in_progress" as const,
      startedAt: new Date().toISOString(),
      timeSpentSeconds: 0,
      score: 0,
      accuracy: 0,
      answers: buildAttemptAnswers(quizId),
    };

    state.quizAttempts.push(attempt);

    return {
      attempt,
      quiz,
      questions: state.questions.filter((item) => item.quizId === quiz.id),
    };
  },

  submitQuiz(userId: string, payload: { attemptId: string; answers: QuizAnswer[]; timeSpentSeconds: number }) {
    const attempt = getAttemptOrThrow(payload.attemptId);

    if (attempt.userId !== userId) {
      throw new AppError("Cannot submit another user's attempt", 403);
    }

    const quiz = getQuizOrThrow(attempt.quizId);
    const relatedQuestions = state.questions.filter((item) => item.quizId === quiz.id);
    const normalizedAnswers = buildAttemptAnswers(quiz.id).map((base) => {
      const answer = payload.answers.find((item) => item.questionId === base.questionId);
      return answer ? { ...base, ...answer } : base;
    });

    const correctCount = relatedQuestions.filter((question) => {
      const answer = normalizedAnswers.find((item) => item.questionId === question.id);
      return answer?.optionId === question.correctOptionId;
    }).length;

    const accuracy = round((correctCount / relatedQuestions.length) * 100);

    attempt.answers = normalizedAnswers;
    attempt.status = "submitted";
    attempt.submittedAt = new Date().toISOString();
    attempt.timeSpentSeconds = payload.timeSpentSeconds;
    attempt.accuracy = accuracy;
    attempt.score = accuracy;

    const snapshot = state.progressSnapshots.find((item) => item.userId === userId);

    if (snapshot) {
      const submittedAttempts = state.quizAttempts.filter(
        (item) => item.userId === userId && item.status === "submitted",
      );
      snapshot.quizzesTaken = submittedAttempts.length;
      snapshot.averageAccuracy = round(
        submittedAttempts.reduce((sum, item) => sum + item.accuracy, 0) / submittedAttempts.length,
      );
      const topics = buildTopicBreakdown(quiz.id, normalizedAnswers);
      snapshot.weakTopics = topics.weakTopics;
      snapshot.strongTopics = topics.strongTopics;
    }

    return this.getResult(attempt.id, userId);
  },

  getResult(attemptId: string, userId: string): QuizResultPayload {
    const attempt = getAttemptOrThrow(attemptId);

    if (attempt.userId !== userId) {
      throw new AppError("Cannot view another user's result", 403);
    }

    const quiz = getQuizOrThrow(attempt.quizId);
    const relatedQuestions = state.questions.filter((item) => item.quizId === quiz.id);
    const topics = buildTopicBreakdown(quiz.id, attempt.answers);

    return {
      attempt,
      quiz,
      questions: relatedQuestions,
      weakTopics: topics.weakTopics,
      strongTopics: topics.strongTopics,
    };
  },

  getQuestions(query?: { quizId?: string; subject?: string }) {
    return state.questions.filter((item) => {
      const matchesQuiz = query?.quizId ? item.quizId === query.quizId : true;
      const matchesSubject = query?.subject
        ? item.subject.toLowerCase() === query.subject.toLowerCase()
        : true;
      return matchesQuiz && matchesSubject;
    });
  },

  createQuestion(payload: {
    quizId: string;
    subject: string;
    topic: string;
    prompt: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    correctOptionId: string;
    options: Array<{ id: string; label: string; text: string }>;
  }) {
    getQuizOrThrow(payload.quizId);
    const question = {
      id: uuidv4(),
      ...payload,
    };

    state.questions.push(question);
    return question;
  },

  getHistory(userId: string) {
    return state.quizAttempts
      .filter((item) => item.userId === userId)
      .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
      .map((attempt) => ({
        ...attempt,
        quiz: state.quizzes.find((quiz) => quiz.id === attempt.quizId),
      }));
  },
};
