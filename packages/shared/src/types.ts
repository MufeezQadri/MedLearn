export type Role = "student" | "admin";
export type ExamTrack = "MBBS" | "NEET_PG" | "USMLE";
export type Difficulty = "easy" | "medium" | "hard";
export type ContentType = "video" | "pdf";
export type TaskStatus = "todo" | "in_progress" | "done";
export type NotificationType = "system" | "planner" | "recommendation" | "quiz";
export type AttemptStatus = "in_progress" | "submitted";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  examTrack: ExamTrack;
  avatarUrl?: string;
  streakDays: number;
  weakTopics: string[];
  strongTopics: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  difficulty: Difficulty;
  durationHours: number;
  educator: string;
  thumbnailUrl: string;
  progressPercent: number;
  enrolledStudents: number;
  tags: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  durationMinutes: number;
  orderIndex: number;
  completionPercent: number;
  videoId?: string;
  pdfId?: string;
}

export interface VideoResource {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string;
  transcript: string;
}

export interface PdfResource {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  pageCount: number;
  pdfUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  edition: string;
  coverUrl: string;
  description: string;
  featured: boolean;
  tags: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: string;
  quizId: string;
  subject: string;
  topic: string;
  prompt: string;
  explanation: string;
  difficulty: Difficulty;
  correctOptionId: string;
  options: QuestionOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  examTrack: ExamTrack;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: Difficulty;
  topicFocus: string[];
}

export interface QuizAnswer {
  questionId: string;
  optionId?: string;
  markedForReview: boolean;
  eliminatedOptionIds: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds: number;
  score: number;
  accuracy: number;
  answers: QuizAnswer[];
}

export interface ProgressSnapshot {
  userId: string;
  completedCourses: number;
  completionPercent: number;
  hoursLearned: number;
  quizzesTaken: number;
  averageAccuracy: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface AnalyticsInsight {
  label: string;
  value: number;
  trend: number;
}

export interface StudyTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  scheduledFor: string;
  status: TaskStatus;
  category: "course" | "quiz" | "revision" | "ai";
}

export interface StudyPlan {
  date: string;
  tasks: StudyTask[];
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

export interface Note {
  id: string;
  userId: string;
  moduleId?: string;
  bookId?: string;
  content: string;
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  topic: string;
  priority: "high" | "medium" | "low";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface DashboardPayload {
  user: User;
  progress: ProgressSnapshot;
  recommendations: AIRecommendation[];
  courses: Course[];
  planner: StudyPlan;
  notifications: UserNotification[];
}

export interface QuizResultPayload {
  attempt: QuizAttempt;
  quiz: Quiz;
  questions: Question[];
  weakTopics: string[];
  strongTopics: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
