import bcrypt from "bcryptjs";
import {
  assistantConversation,
  books,
  courses,
  modules,
  notifications,
  notes,
  pdfs,
  progressSnapshots,
  questions,
  quizAttempts,
  quizzes,
  recommendations,
  studyTasks,
  users,
  videos,
} from "@medlearn/shared";

const clone = <T>(value: T): T => structuredClone(value);

export const state = {
  users: clone(users),
  courses: clone(courses),
  modules: clone(modules),
  videos: clone(videos),
  pdfs: clone(pdfs),
  books: clone(books),
  quizzes: clone(quizzes),
  questions: clone(questions),
  quizAttempts: clone(quizAttempts),
  progressSnapshots: clone(progressSnapshots),
  studyTasks: clone(studyTasks),
  notifications: clone(notifications),
  notes: clone(notes),
  recommendations: clone(recommendations),
  assistantConversation: clone(assistantConversation),
};

export const passwordHashes = new Map<string, string>([
  ["sarah@medlearn.ai", bcrypt.hashSync("Password@123", 10)],
  ["admin@medlearn.ai", bcrypt.hashSync("Admin@123", 10)],
]);

export const refreshTokens = new Set<string>();
