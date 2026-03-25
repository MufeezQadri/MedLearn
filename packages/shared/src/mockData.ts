import type {
  AIRecommendation,
  AnalyticsInsight,
  Book,
  ChatMessage,
  Course,
  DashboardPayload,
  Module,
  Note,
  PdfResource,
  ProgressSnapshot,
  Question,
  Quiz,
  QuizAttempt,
  StudyPlan,
  StudyTask,
  User,
  UserNotification,
  VideoResource,
} from "./types";

export const users: User[] = [
  {
    id: "user-sarah",
    fullName: "Dr. Sarah Khan",
    email: "sarah@medlearn.ai",
    role: "student",
    examTrack: "NEET_PG",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    streakDays: 15,
    weakTopics: ["Cardiac cycle", "Ventilator settings", "Acid-base disorders"],
    strongTopics: ["Neuroanatomy", "Respiratory pathology", "Antibiotics"],
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "admin-1",
    fullName: "MedLearn Admin",
    email: "admin@medlearn.ai",
    role: "admin",
    examTrack: "MBBS",
    streakDays: 0,
    weakTopics: [],
    strongTopics: [],
    createdAt: "2025-10-01T00:00:00.000Z",
  },
];

export const courses: Course[] = [
  {
    id: "course-cardiology",
    slug: "clinical-cardiology-masterclass",
    title: "Clinical Cardiology Masterclass",
    description:
      "High-yield cardiovascular medicine for MBBS, NEET PG, and internship prep.",
    subject: "Medicine",
    difficulty: "hard",
    durationHours: 32,
    educator: "Dr. Sarah Jenkins",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    progressPercent: 68,
    enrolledStudents: 18241,
    tags: ["ECG", "Heart failure", "Valvular disease"],
  },
  {
    id: "course-neuro",
    slug: "advanced-neuroanatomy",
    title: "Advanced Neuroanatomy",
    description:
      "An editorial, image-rich neuroanatomy course tuned for concept retention.",
    subject: "Anatomy",
    difficulty: "medium",
    durationHours: 24,
    educator: "Dr. Michael Chen",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    progressPercent: 15,
    enrolledStudents: 9260,
    tags: ["Cranial nerves", "Basal ganglia", "Clinical correlations"],
  },
  {
    id: "course-pathology",
    slug: "pathology-rapid-revision",
    title: "Pathology Rapid Revision",
    description:
      "Fast, exam-driven pathology review with AI weak-topic remediation.",
    subject: "Pathology",
    difficulty: "medium",
    durationHours: 18,
    educator: "Dr. Priya Menon",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
    progressPercent: 52,
    enrolledStudents: 15442,
    tags: ["Inflammation", "Neoplasia", "Hemodynamics"],
  },
];

export const modules: Module[] = [
  {
    id: "module-ecg",
    courseId: "course-cardiology",
    title: "ECG Interpretation Essentials",
    summary: "Systematic rhythm interpretation, axis, and ischemia patterns.",
    durationMinutes: 74,
    orderIndex: 1,
    completionPercent: 100,
    videoId: "video-ecg",
    pdfId: "pdf-ecg",
  },
  {
    id: "module-heart-failure",
    courseId: "course-cardiology",
    title: "Heart Failure & Hemodynamics",
    summary: "Preload, afterload, compensated states, and evidence-based therapy.",
    durationMinutes: 96,
    orderIndex: 2,
    completionPercent: 64,
    videoId: "video-heart-failure",
    pdfId: "pdf-heart-failure",
  },
  {
    id: "module-cranial-nerves",
    courseId: "course-neuro",
    title: "Cranial Nerves Deep Dive",
    summary: "Nuclei, lesions, reflexes, and clinical pearls.",
    durationMinutes: 82,
    orderIndex: 1,
    completionPercent: 40,
    videoId: "video-cranial-nerves",
    pdfId: "pdf-cranial-nerves",
  },
  {
    id: "module-inflammation",
    courseId: "course-pathology",
    title: "Inflammation & Repair",
    summary: "Mediators, acute vs chronic inflammation, and tissue healing.",
    durationMinutes: 68,
    orderIndex: 1,
    completionPercent: 75,
    videoId: "video-inflammation",
    pdfId: "pdf-inflammation",
  },
];

export const videos: VideoResource[] = [
  {
    id: "video-ecg",
    moduleId: "module-ecg",
    title: "ECG Interpretation Essentials",
    description: "Reading rate, rhythm, axis, intervals, and ischemic changes.",
    durationMinutes: 74,
    videoUrl: "https://example.com/videos/ecg-interpretation",
    transcript: "ECG interpretation starts with rate, rhythm, axis, intervals, and morphology.",
  },
  {
    id: "video-heart-failure",
    moduleId: "module-heart-failure",
    title: "Heart Failure & Hemodynamics",
    description: "Understand forward failure, congestion, and treatment ladders.",
    durationMinutes: 96,
    videoUrl: "https://example.com/videos/heart-failure",
    transcript: "Heart failure is a clinical syndrome caused by structural or functional impairment.",
  },
  {
    id: "video-cranial-nerves",
    moduleId: "module-cranial-nerves",
    title: "Cranial Nerves Deep Dive",
    description: "Applied neuroanatomy with lesion localization.",
    durationMinutes: 82,
    videoUrl: "https://example.com/videos/cranial-nerves",
    transcript: "Each cranial nerve has unique nuclei, exits, and common lesion patterns.",
  },
  {
    id: "video-inflammation",
    moduleId: "module-inflammation",
    title: "Inflammation & Repair",
    description: "High-yield pathology revision for mediators and chronic inflammation.",
    durationMinutes: 68,
    videoUrl: "https://example.com/videos/inflammation",
    transcript: "Acute inflammation is characterized by vascular changes and neutrophil migration.",
  },
];

export const pdfs: PdfResource[] = [
  {
    id: "pdf-ecg",
    moduleId: "module-ecg",
    title: "ECG Interpretation Cheat Sheet",
    description: "One-page algorithmic approach to ECG questions.",
    pageCount: 18,
    pdfUrl: "https://example.com/pdfs/ecg-cheat-sheet.pdf",
  },
  {
    id: "pdf-heart-failure",
    moduleId: "module-heart-failure",
    title: "Heart Failure Pharmacology Review",
    description: "Guideline-based summary of HFrEF and HFpEF therapy.",
    pageCount: 22,
    pdfUrl: "https://example.com/pdfs/heart-failure-review.pdf",
  },
  {
    id: "pdf-cranial-nerves",
    moduleId: "module-cranial-nerves",
    title: "Cranial Nerve Lesion Map",
    description: "Clinical syndromes, reflexes, and nuclei tables.",
    pageCount: 16,
    pdfUrl: "https://example.com/pdfs/cranial-nerve-lesions.pdf",
  },
  {
    id: "pdf-inflammation",
    moduleId: "module-inflammation",
    title: "Inflammation Revision Notes",
    description: "Mediators, cells, repair sequence, and exam traps.",
    pageCount: 14,
    pdfUrl: "https://example.com/pdfs/inflammation-notes.pdf",
  },
];

export const books: Book[] = [
  {
    id: "book-grays",
    title: "Gray's Anatomy",
    author: "Susan Standring",
    category: "Pre-Clinical",
    edition: "42nd Edition",
    coverUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    description: "Authoritative anatomy reference with clinical integration.",
    featured: true,
    tags: ["Core", "Classic", "Anatomy"],
  },
  {
    id: "book-guyton",
    title: "Guyton and Hall Textbook of Medical Physiology",
    author: "John E. Hall",
    category: "Pre-Clinical",
    edition: "14th Edition",
    coverUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    description: "Gold standard physiology text for fundamentals and exams.",
    featured: true,
    tags: ["Gold Standard", "Physiology"],
  },
  {
    id: "book-harrison",
    title: "Harrison's Principles of Internal Medicine",
    author: "J. Larry Jameson",
    category: "Clinical",
    edition: "21st Edition",
    coverUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    description: "Comprehensive medicine text with system-wise disease reviews.",
    featured: true,
    tags: ["Medicine", "Clinical"],
  },
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-cardiology",
    title: "Cardiovascular Systems Drill",
    description: "Timed practice focused on cardiology concepts and clinical reasoning.",
    subject: "Medicine",
    examTrack: "NEET_PG",
    durationMinutes: 85,
    totalQuestions: 6,
    difficulty: "hard",
    topicFocus: ["Cardiac cycle", "Heart sounds", "Shock", "Valvular disease"],
  },
  {
    id: "quiz-pathology",
    title: "Inflammation & Repair Sprint",
    description: "Rapid pathology revision with explanation-first feedback.",
    subject: "Pathology",
    examTrack: "MBBS",
    durationMinutes: 35,
    totalQuestions: 4,
    difficulty: "medium",
    topicFocus: ["Inflammation", "Mediators", "Repair"],
  },
  {
    id: "quiz-usmle-pulm",
    title: "USMLE Pulmonology High-Yield MCQs",
    description: "Step-style question set on respiratory disease and physiology.",
    subject: "Medicine",
    examTrack: "USMLE",
    durationMinutes: 45,
    totalQuestions: 4,
    difficulty: "hard",
    topicFocus: ["Pneumonia", "ARDS", "Ventilator settings"],
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Cardiac cycle",
    prompt: "Which of the following events occurs during isovolumetric contraction?",
    explanation:
      "Both the mitral and aortic valves are closed, so ventricular pressure rises without a change in volume.",
    difficulty: "medium",
    correctOptionId: "q1-b",
    options: [
      { id: "q1-a", label: "A", text: "Rapid ventricular filling" },
      { id: "q1-b", label: "B", text: "Rise in ventricular pressure at constant volume" },
      { id: "q1-c", label: "C", text: "Opening of semilunar valves" },
      { id: "q1-d", label: "D", text: "Atrial contraction" },
    ],
  },
  {
    id: "q2",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Valvular disease",
    prompt: "A mid-diastolic murmur with opening snap is most suggestive of:",
    explanation: "The classic auscultatory finding is mitral stenosis.",
    difficulty: "easy",
    correctOptionId: "q2-a",
    options: [
      { id: "q2-a", label: "A", text: "Mitral stenosis" },
      { id: "q2-b", label: "B", text: "Aortic regurgitation" },
      { id: "q2-c", label: "C", text: "Mitral regurgitation" },
      { id: "q2-d", label: "D", text: "Aortic stenosis" },
    ],
  },
  {
    id: "q3",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Shock",
    prompt: "The most likely hemodynamic profile in septic shock is:",
    explanation:
      "Septic shock typically presents with reduced systemic vascular resistance and elevated cardiac output in the warm phase.",
    difficulty: "hard",
    correctOptionId: "q3-c",
    options: [
      { id: "q3-a", label: "A", text: "High SVR, low cardiac output" },
      { id: "q3-b", label: "B", text: "High SVR, high cardiac output" },
      { id: "q3-c", label: "C", text: "Low SVR, high cardiac output" },
      { id: "q3-d", label: "D", text: "Normal SVR, low preload" },
    ],
  },
  {
    id: "q4",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Heart sounds",
    prompt: "A fixed split S2 is classically associated with:",
    explanation: "Atrial septal defect causes fixed splitting of the second heart sound.",
    difficulty: "medium",
    correctOptionId: "q4-d",
    options: [
      { id: "q4-a", label: "A", text: "Pulmonary hypertension" },
      { id: "q4-b", label: "B", text: "Aortic stenosis" },
      { id: "q4-c", label: "C", text: "Mitral valve prolapse" },
      { id: "q4-d", label: "D", text: "Atrial septal defect" },
    ],
  },
  {
    id: "q5",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Cardiac cycle",
    prompt: "The a wave in the jugular venous pulse corresponds to:",
    explanation: "The a wave reflects right atrial contraction.",
    difficulty: "easy",
    correctOptionId: "q5-b",
    options: [
      { id: "q5-a", label: "A", text: "Ventricular systole" },
      { id: "q5-b", label: "B", text: "Atrial contraction" },
      { id: "q5-c", label: "C", text: "Opening of the tricuspid valve" },
      { id: "q5-d", label: "D", text: "Venous filling of the atrium" },
    ],
  },
  {
    id: "q6",
    quizId: "quiz-cardiology",
    subject: "Medicine",
    topic: "Heart failure",
    prompt: "Which drug class has a proven mortality benefit in HFrEF?",
    explanation: "ACE inhibitors, beta blockers, MRAs, and SGLT2 inhibitors improve survival in HFrEF.",
    difficulty: "medium",
    correctOptionId: "q6-c",
    options: [
      { id: "q6-a", label: "A", text: "Loop diuretics alone" },
      { id: "q6-b", label: "B", text: "Digoxin alone" },
      { id: "q6-c", label: "C", text: "ACE inhibitors" },
      { id: "q6-d", label: "D", text: "Nitrates only" },
    ],
  },
  {
    id: "q7",
    quizId: "quiz-pathology",
    subject: "Pathology",
    topic: "Inflammation",
    prompt: "The first cells to arrive in acute inflammation are usually:",
    explanation: "Neutrophils dominate the early phase of acute inflammation.",
    difficulty: "easy",
    correctOptionId: "q7-a",
    options: [
      { id: "q7-a", label: "A", text: "Neutrophils" },
      { id: "q7-b", label: "B", text: "Lymphocytes" },
      { id: "q7-c", label: "C", text: "Eosinophils" },
      { id: "q7-d", label: "D", text: "Fibroblasts" },
    ],
  },
  {
    id: "q8",
    quizId: "quiz-pathology",
    subject: "Pathology",
    topic: "Repair",
    prompt: "Granulation tissue is characterized by:",
    explanation: "Granulation tissue contains proliferating capillaries and fibroblasts.",
    difficulty: "medium",
    correctOptionId: "q8-d",
    options: [
      { id: "q8-a", label: "A", text: "Dense collagen and scarce vessels" },
      { id: "q8-b", label: "B", text: "Hyalinized scar only" },
      { id: "q8-c", label: "C", text: "Caseous necrosis" },
      { id: "q8-d", label: "D", text: "New capillaries and fibroblasts" },
    ],
  },
  {
    id: "q9",
    quizId: "quiz-usmle-pulm",
    subject: "Medicine",
    topic: "Pneumonia",
    prompt: "The most common cause of community-acquired pneumonia is:",
    explanation: "Streptococcus pneumoniae remains the most common cause of typical CAP.",
    difficulty: "medium",
    correctOptionId: "q9-a",
    options: [
      { id: "q9-a", label: "A", text: "Streptococcus pneumoniae" },
      { id: "q9-b", label: "B", text: "Mycoplasma pneumoniae" },
      { id: "q9-c", label: "C", text: "Haemophilus influenzae" },
      { id: "q9-d", label: "D", text: "Staphylococcus aureus" },
    ],
  },
  {
    id: "q10",
    quizId: "quiz-usmle-pulm",
    subject: "Medicine",
    topic: "ARDS",
    prompt: "A key pathologic feature of ARDS is:",
    explanation: "Diffuse alveolar damage with hyaline membrane formation defines ARDS.",
    difficulty: "hard",
    correctOptionId: "q10-b",
    options: [
      { id: "q10-a", label: "A", text: "Pleural fibrosis" },
      { id: "q10-b", label: "B", text: "Diffuse alveolar damage" },
      { id: "q10-c", label: "C", text: "Bronchial smooth muscle hypertrophy" },
      { id: "q10-d", label: "D", text: "Caseating granulomas" },
    ],
  },
];

export const quizAttempts: QuizAttempt[] = [
  {
    id: "attempt-cardiology-1",
    quizId: "quiz-cardiology",
    userId: "user-sarah",
    status: "submitted",
    startedAt: "2026-03-21T06:00:00.000Z",
    submittedAt: "2026-03-21T07:04:00.000Z",
    timeSpentSeconds: 3840,
    score: 83,
    accuracy: 83,
    answers: [
      { questionId: "q1", optionId: "q1-b", markedForReview: false, eliminatedOptionIds: [] },
      { questionId: "q2", optionId: "q2-a", markedForReview: false, eliminatedOptionIds: [] },
      { questionId: "q3", optionId: "q3-c", markedForReview: true, eliminatedOptionIds: ["q3-b"] },
      { questionId: "q4", optionId: "q4-d", markedForReview: false, eliminatedOptionIds: [] },
      { questionId: "q5", optionId: "q5-d", markedForReview: false, eliminatedOptionIds: [] },
      { questionId: "q6", optionId: "q6-c", markedForReview: false, eliminatedOptionIds: [] },
    ],
  },
];

export const progressSnapshots: ProgressSnapshot[] = [
  {
    userId: "user-sarah",
    completedCourses: 4,
    completionPercent: 72,
    hoursLearned: 126,
    quizzesTaken: 38,
    averageAccuracy: 78,
    weakTopics: ["Cardiac cycle", "Ventilator settings", "Acid-base disorders"],
    strongTopics: ["Neuroanatomy", "Antibiotics", "Inflammation"],
  },
];

export const analyticsInsights: AnalyticsInsight[] = [
  { label: "Accuracy", value: 78, trend: 6 },
  { label: "Study Hours", value: 12.4, trend: 8 },
  { label: "Quiz Velocity", value: 42, trend: -5 },
  { label: "Revision Consistency", value: 88, trend: 12 },
];

export const studyTasks: StudyTask[] = [
  {
    id: "task-1",
    userId: "user-sarah",
    title: "Review Physiology",
    description: "Cardiac cycle and pressure-volume loops",
    scheduledFor: "2026-03-25T04:00:00.000Z",
    status: "todo",
    category: "revision",
  },
  {
    id: "task-2",
    userId: "user-sarah",
    title: "15 MCQs in Pathology",
    description: "Focus on neoplasia and inflammation",
    scheduledFor: "2026-03-25T06:30:00.000Z",
    status: "in_progress",
    category: "quiz",
  },
  {
    id: "task-3",
    userId: "user-sarah",
    title: "Watch ECG Lecture",
    description: "Module 4: Arrhythmias and conduction blocks",
    scheduledFor: "2026-03-25T09:30:00.000Z",
    status: "todo",
    category: "course",
  },
];

export const studyPlan: StudyPlan = {
  date: "2026-03-25",
  tasks: studyTasks,
};

export const notifications: UserNotification[] = [
  {
    id: "notif-1",
    userId: "user-sarah",
    title: "Mock NEET PG Simulation",
    message: "Your full-length simulation starts Saturday at 9:00 AM.",
    type: "quiz",
    createdAt: "2026-03-24T11:00:00.000Z",
    read: false,
  },
  {
    id: "notif-2",
    userId: "user-sarah",
    title: "AI Recommendation Ready",
    message: "Cardiac cycle and ventilator settings were added to your focus stack.",
    type: "recommendation",
    createdAt: "2026-03-24T08:20:00.000Z",
    read: true,
  },
];

export const notes: Note[] = [
  {
    id: "note-1",
    userId: "user-sarah",
    moduleId: "module-heart-failure",
    content: "S3 is a sign of volume overload. Distinguish HFrEF vs HFpEF therapy tables.",
    createdAt: "2026-03-22T10:30:00.000Z",
  },
];

export const recommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    userId: "user-sarah",
    title: "Rebuild your cardiac cycle foundation",
    description: "You miss pressure-volume and valve timing questions under time pressure.",
    topic: "Cardiac cycle",
    priority: "high",
  },
  {
    id: "rec-2",
    userId: "user-sarah",
    title: "Schedule a 20-minute ventilator revision",
    description: "USMLE-style respiratory support questions are trending below your baseline.",
    topic: "Ventilator settings",
    priority: "medium",
  },
  {
    id: "rec-3",
    userId: "user-sarah",
    title: "Lean into neuroanatomy momentum",
    description: "Your strongest recall window is in anatomy. Convert it into spaced revision.",
    topic: "Neuroanatomy",
    priority: "low",
  },
];

export const assistantConversation: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "You’ve been strongest in anatomy this week. If we focus on cardiac cycle today, I can generate a 25-minute revision block plus 10 custom MCQs.",
    createdAt: "2026-03-25T05:00:00.000Z",
  },
  {
    id: "msg-2",
    role: "user",
    content: "Why is isovolumetric contraction tested so often?",
    createdAt: "2026-03-25T05:01:00.000Z",
  },
];

export const dashboardPayload: DashboardPayload = {
  user: users[0],
  progress: progressSnapshots[0],
  recommendations,
  courses,
  planner: studyPlan,
  notifications,
};
