import {
  analyticsInsights,
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
  type Note,
  type QuizAnswer,
  type QuizAttempt,
  type QuizResultPayload,
  type StudyTask,
  type User,
} from "@medlearn/shared";

const clone = <T,>(value: T): T => structuredClone(value);

const ATTEMPTS_KEY = "medlearn.attempts";
const TASKS_KEY = "medlearn.tasks";
const NOTES_KEY = "medlearn.notes";

const hasWindow = () => typeof window !== "undefined";

const readStorage = <T,>(key: string, fallback: T): T => {
  if (!hasWindow()) {
    return clone(fallback);
  }

  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : clone(fallback);
};

const writeStorage = <T,>(key: string, value: T) => {
  if (hasWindow()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const getAttempts = () => readStorage<QuizAttempt[]>(ATTEMPTS_KEY, quizAttempts);
const setAttempts = (value: QuizAttempt[]) => writeStorage(ATTEMPTS_KEY, value);
const getTasks = () => readStorage<StudyTask[]>(TASKS_KEY, studyTasks);
const setTasks = (value: StudyTask[]) => writeStorage(TASKS_KEY, value);
const getNotes = () => readStorage<Note[]>(NOTES_KEY, notes);
const setNotes = (value: Note[]) => writeStorage(NOTES_KEY, value);

const getQuestionSet = (quizId: string) => questions.filter((item) => item.quizId === quizId);

const buildBlankAnswers = (quizId: string): QuizAnswer[] =>
  getQuestionSet(quizId).map((question) => ({
    questionId: question.id,
    markedForReview: false,
    eliminatedOptionIds: [],
  }));

const topicBreakdown = (quizId: string, answers: QuizAnswer[]) => {
  const buckets = new Map<string, { total: number; correct: number }>();

  getQuestionSet(quizId).forEach((question) => {
    const bucket = buckets.get(question.topic) ?? { total: 0, correct: 0 };
    const answer = answers.find((item) => item.questionId === question.id);
    bucket.total += 1;
    if (answer?.optionId === question.correctOptionId) {
      bucket.correct += 1;
    }
    buckets.set(question.topic, bucket);
  });

  return [...buckets.entries()].map(([topic, stats]) => ({
    topic,
    accuracy: stats.total === 0 ? 0 : (stats.correct / stats.total) * 100,
  }));
};

export const mockApp = {
  login(email: string, password: string) {
    const normalized = email.toLowerCase();
    const user = users.find((item) => item.email === normalized);

    if (!user) {
      throw new Error("User not found. Try sarah@medlearn.ai or admin@medlearn.ai.");
    }

    const valid =
      (normalized === "sarah@medlearn.ai" && password === "Password@123") ||
      (normalized === "admin@medlearn.ai" && password === "Admin@123");

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    return user;
  },

  signup(payload: { fullName: string; email: string; examTrack: User["examTrack"] }) {
    return {
      id: `local-${Date.now()}`,
      role: "student" as const,
      streakDays: 1,
      weakTopics: [],
      strongTopics: [],
      createdAt: new Date().toISOString(),
      ...payload,
    };
  },

  getUser(userId: string) {
    return users.find((item) => item.id === userId) ?? users[0];
  },

  getCourses(search?: string) {
    const needle = search?.toLowerCase();
    if (!needle) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(needle) ||
        course.subject.toLowerCase().includes(needle) ||
        course.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  },

  getCourse(courseId: string) {
    const course = courses.find((item) => item.id === courseId || item.slug === courseId) ?? courses[0];
    return {
      ...course,
      modules: modules.filter((item) => item.courseId === course.id),
    };
  },

  getModule(moduleId: string) {
    return modules.find((item) => item.id === moduleId);
  },

  getVideo(videoId: string) {
    return videos.find((item) => item.id === videoId);
  },

  getPdf(pdfId: string) {
    return pdfs.find((item) => item.id === pdfId);
  },

  getBooks(search?: string) {
    const needle = search?.toLowerCase();
    if (!needle) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(needle) ||
        book.author.toLowerCase().includes(needle) ||
        book.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  },

  getQuizzes() {
    return quizzes;
  },

  getQuiz(quizId: string) {
    const quiz = quizzes.find((item) => item.id === quizId) ?? quizzes[0];
    return {
      ...quiz,
      questions: getQuestionSet(quiz.id),
    };
  },

  getQuizHistory(userId: string) {
    return getAttempts().filter((item) => item.userId === userId);
  },

  startQuiz(userId: string, quizId: string) {
    const allAttempts = getAttempts();
    const active =
      allAttempts.find((item) => item.userId === userId && item.quizId === quizId && item.status === "in_progress") ??
      null;

    if (active) {
      return active;
    }

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      userId,
      status: "in_progress",
      startedAt: new Date().toISOString(),
      timeSpentSeconds: 0,
      score: 0,
      accuracy: 0,
      answers: buildBlankAnswers(quizId),
    };

    allAttempts.push(attempt);
    setAttempts(allAttempts);
    return attempt;
  },

  submitQuiz(userId: string, attemptId: string, answers: QuizAnswer[], timeSpentSeconds: number): QuizResultPayload {
    const allAttempts = getAttempts();
    const attempt = allAttempts.find((item) => item.id === attemptId && item.userId === userId);

    if (!attempt) {
      throw new Error("Quiz attempt not found");
    }

    const questionSet = getQuestionSet(attempt.quizId);
    const correct = questionSet.filter((question) => {
      const answer = answers.find((item) => item.questionId === question.id);
      return answer?.optionId === question.correctOptionId;
    }).length;
    const accuracy = Math.round((correct / questionSet.length) * 100);

    attempt.answers = answers;
    attempt.timeSpentSeconds = timeSpentSeconds;
    attempt.status = "submitted";
    attempt.submittedAt = new Date().toISOString();
    attempt.score = accuracy;
    attempt.accuracy = accuracy;
    setAttempts(allAttempts);

    return this.getQuizResult(userId, attemptId);
  },

  getQuizResult(userId: string, attemptId: string): QuizResultPayload {
    const attempt = getAttempts().find((item) => item.id === attemptId && item.userId === userId);

    if (!attempt) {
      throw new Error("Result not found");
    }

    const quiz = quizzes.find((item) => item.id === attempt.quizId) ?? quizzes[0];
    const breakdown = topicBreakdown(quiz.id, attempt.answers);

    return {
      attempt,
      quiz,
      questions: getQuestionSet(quiz.id),
      weakTopics: breakdown.filter((item) => item.accuracy < 70).map((item) => item.topic),
      strongTopics: breakdown.filter((item) => item.accuracy >= 85).map((item) => item.topic),
    };
  },

  getProgress(userId: string) {
    return progressSnapshots.find((item) => item.userId === userId) ?? progressSnapshots[0];
  },

  getPlanner(userId: string) {
    return getTasks()
      .filter((item) => item.userId === userId)
      .sort((left, right) => left.scheduledFor.localeCompare(right.scheduledFor));
  },

  addTask(userId: string, task: Omit<StudyTask, "id" | "userId" | "status">) {
    const next: StudyTask = {
      id: `task-${Date.now()}`,
      userId,
      status: "todo",
      ...task,
    };
    const tasks = [...getTasks(), next];
    setTasks(tasks);
    return next;
  },

  removeTask(userId: string, taskId: string) {
    const tasks = getTasks().filter((item) => !(item.userId === userId && item.id === taskId));
    setTasks(tasks);
  },

  getNotifications(userId: string) {
    return notifications.filter((item) => item.userId === userId);
  },

  getRecommendations(userId: string) {
    return recommendations.filter((item) => item.userId === userId);
  },

  getAnalytics() {
    return analyticsInsights;
  },

  getAssistantConversation() {
    return assistantConversation;
  },

  askAssistant(prompt: string) {
    return {
      id: `ai-${Date.now()}`,
      role: "assistant" as const,
      content:
        "Focus on mechanism before memorization. For this concept, connect the physiology, the common exam trap, and one patient presentation.",
      createdAt: new Date().toISOString(),
      prompt,
    };
  },

  getNotes(moduleId?: string) {
    return getNotes().filter((note) => (moduleId ? note.moduleId === moduleId : true));
  },

  addNote(userId: string, payload: { moduleId?: string; bookId?: string; content: string }) {
    const next: Note = {
      id: `note-${Date.now()}`,
      userId,
      moduleId: payload.moduleId,
      bookId: payload.bookId,
      content: payload.content,
      createdAt: new Date().toISOString(),
    };
    const nextNotes = [...getNotes(), next];
    setNotes(nextNotes);
    return next;
  },
};
