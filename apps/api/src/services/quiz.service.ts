import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/db.js";
import { AppError } from "../lib/http-error.js";

const round = (value: number) => Math.round(value * 100) / 100;

export const quizService = {
  async getQuizzes() {
    const quizzes = await prisma.quiz.findMany({
      include: { _count: { select: { questions: true } } },
    });
    return quizzes.map((q) => ({
      ...q,
      topicFocus: q.topicFocus ? q.topicFocus.split(",") : [],
      totalQuestions: q._count.questions,
    }));
  },

  async getQuiz(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: { include: { options: true } },
      },
    });
    if (!quiz) throw new AppError("Quiz not found", 404);
    return {
      ...quiz,
      topicFocus: quiz.topicFocus ? quiz.topicFocus.split(",") : [],
      questions: quiz.questions,
    };
  },

  async startQuiz(userId: string, quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new AppError("Quiz not found", 404);

    // Check for existing in-progress attempt
    const existing = await prisma.quizAttempt.findFirst({
      where: { quizId, userId, status: "in_progress" },
    });

    if (existing) {
      return {
        attempt: { ...existing, weakTopics: existing.weakTopics.split(",").filter(Boolean), strongTopics: existing.strongTopics.split(",").filter(Boolean), answers: JSON.parse(existing.answersJson || "[]") },
        quiz: { ...quiz, topicFocus: quiz.topicFocus.split(",") },
        questions: quiz.questions,
      };
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        status: "in_progress",
        weakTopics: "",
        strongTopics: "",
        answersJson: JSON.stringify(quiz.questions.map((q) => ({ questionId: q.id, markedForReview: false, eliminatedOptionIds: [] }))),
      },
    });

    return {
      attempt: { ...attempt, weakTopics: [], strongTopics: [], answers: JSON.parse(attempt.answersJson) },
      quiz: { ...quiz, topicFocus: quiz.topicFocus.split(",") },
      questions: quiz.questions,
    };
  },

  async submitQuiz(userId: string, payload: { attemptId: string; answers: any[]; timeSpentSeconds: number }) {
    const attempt = await prisma.quizAttempt.findUnique({ where: { id: payload.attemptId } });
    if (!attempt) throw new AppError("Attempt not found", 404);
    if (attempt.userId !== userId) throw new AppError("Cannot submit another user's attempt", 403);

    const quiz = await prisma.quiz.findUnique({
      where: { id: attempt.quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new AppError("Quiz not found", 404);

    const correctCount = quiz.questions.filter((q) => {
      const answer = payload.answers.find((a) => a.questionId === q.id);
      return answer?.optionId === q.correctOptionId;
    }).length;

    const accuracy = round((correctCount / (quiz.questions.length || 1)) * 100);

    // Build topic breakdown
    const topicMap = new Map<string, { correct: number; total: number }>();
    quiz.questions.forEach((q) => {
      const bucket = topicMap.get(q.topic) ?? { correct: 0, total: 0 };
      const answer = payload.answers.find((a) => a.questionId === q.id);
      if (answer?.optionId === q.correctOptionId) bucket.correct++;
      bucket.total++;
      topicMap.set(q.topic, bucket);
    });

    const weakTopics = [...topicMap.entries()].filter(([_, s]) => (s.correct / s.total) * 100 < 70).map(([t]) => t);
    const strongTopics = [...topicMap.entries()].filter(([_, s]) => (s.correct / s.total) * 100 >= 85).map(([t]) => t);

    const updated = await prisma.quizAttempt.update({
      where: { id: payload.attemptId },
      data: {
        status: "submitted",
        submittedAt: new Date(),
        timeSpentSeconds: payload.timeSpentSeconds,
        score: Math.round(accuracy),
        accuracy,
        weakTopics: weakTopics.join(","),
        strongTopics: strongTopics.join(","),
        answersJson: JSON.stringify(payload.answers),
      },
    });

    return {
      attempt: { ...updated, weakTopics, strongTopics, answers: payload.answers },
      quiz: { ...quiz, topicFocus: quiz.topicFocus.split(",") },
      questions: quiz.questions,
      weakTopics,
      strongTopics,
    };
  },

  async getResult(attemptId: string, userId: string) {
    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new AppError("Attempt not found", 404);
    if (attempt.userId !== userId) throw new AppError("Cannot view another user's result", 403);

    const quiz = await prisma.quiz.findUnique({
      where: { id: attempt.quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new AppError("Quiz not found", 404);

    return {
      attempt: {
        ...attempt,
        weakTopics: attempt.weakTopics.split(",").filter(Boolean),
        strongTopics: attempt.strongTopics.split(",").filter(Boolean),
        answers: JSON.parse(attempt.answersJson || "[]"),
      },
      quiz: { ...quiz, topicFocus: quiz.topicFocus.split(",") },
      questions: quiz.questions,
      weakTopics: attempt.weakTopics.split(",").filter(Boolean),
      strongTopics: attempt.strongTopics.split(",").filter(Boolean),
    };
  },

  async getHistory(userId: string) {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      include: { quiz: true },
    });
    return attempts.map((a) => ({
      ...a,
      weakTopics: a.weakTopics.split(",").filter(Boolean),
      strongTopics: a.strongTopics.split(",").filter(Boolean),
      answers: JSON.parse(a.answersJson || "[]"),
    }));
  },

  async getQuestions(query?: { quizId?: string; subject?: string }) {
    const where: any = {};
    if (query?.quizId) where.quizId = query.quizId;
    if (query?.subject) where.subject = { contains: query.subject };

    const questions = await prisma.question.findMany({
      where,
      include: { options: true },
    });
    return questions;
  },

  async createQuestion(payload: {
    quizId: string;
    subject: string;
    topic: string;
    prompt: string;
    explanation: string;
    difficulty: string;
    correctOptionId: string;
    options: Array<{ id: string; label: string; text: string }>;
  }) {
    const quiz = await prisma.quiz.findUnique({ where: { id: payload.quizId } });
    if (!quiz) throw new AppError("Quiz not found", 404);

    const question = await prisma.question.create({
      data: {
        quizId: payload.quizId,
        subject: payload.subject,
        topic: payload.topic,
        prompt: payload.prompt,
        explanation: payload.explanation,
        difficulty: payload.difficulty,
        correctOptionId: payload.correctOptionId,
        options: {
          create: payload.options.map((o) => ({ id: o.id, label: o.label, text: o.text })),
        },
      },
      include: { options: true },
    });

    // Update quiz totalQuestions count
    await prisma.quiz.update({
      where: { id: payload.quizId },
      data: { totalQuestions: { increment: 1 } },
    });

    return question;
  },
};
