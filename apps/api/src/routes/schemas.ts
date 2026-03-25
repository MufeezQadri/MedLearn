import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    examTrack: z.enum(["MBBS", "NEET_PG", "USMLE"]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    avatarUrl: z.string().url().optional(),
    examTrack: z.enum(["MBBS", "NEET_PG", "USMLE"]).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const courseSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    subject: z.string().min(2),
    difficulty: z.enum(["easy", "medium", "hard"]),
    durationHours: z.number().positive(),
    educator: z.string().min(2),
    thumbnailUrl: z.string().url(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateCourseSchema = z.object({
  body: courseSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const noteSchema = z.object({
  body: z.object({
    moduleId: z.string().optional(),
    bookId: z.string().optional(),
    content: z.string().min(5),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const bookSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    author: z.string().min(2),
    category: z.string().min(2),
    edition: z.string().min(2),
    coverUrl: z.string().url(),
    description: z.string().min(10),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const startQuizSchema = z.object({
  body: z.object({
    quizId: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const submitQuizSchema = z.object({
  body: z.object({
    attemptId: z.string().min(1),
    timeSpentSeconds: z.number().nonnegative(),
    answers: z.array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().optional(),
        markedForReview: z.boolean(),
        eliminatedOptionIds: z.array(z.string()),
      }),
    ),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const questionSchema = z.object({
  body: z.object({
    quizId: z.string().min(1),
    subject: z.string().min(2),
    topic: z.string().min(2),
    prompt: z.string().min(10),
    explanation: z.string().min(10),
    difficulty: z.enum(["easy", "medium", "hard"]),
    correctOptionId: z.string().min(1),
    options: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        text: z.string().min(1),
      }),
    ),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const progressUpdateSchema = z.object({
  body: z.object({
    courseId: z.string().optional(),
    moduleId: z.string().optional(),
    completionPercent: z.number().min(0).max(100).optional(),
    hoursLearned: z.number().min(0).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const aiChatSchema = z.object({
  body: z.object({
    prompt: z.string().min(3),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const analyzePerformanceSchema = z.object({
  body: z.object({
    attemptId: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    scheduledFor: z.string().datetime(),
    category: z.enum(["course", "quiz", "revision", "ai"]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const notificationSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    message: z.string().min(3),
    type: z.enum(["system", "planner", "recommendation", "quiz"]),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
