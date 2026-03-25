import 'package:flutter/material.dart';

import 'models.dart';

class DemoCatalog {
  static const student = UserProfile(
    id: 'user-sarah',
    fullName: 'Dr. Sarah Khan',
    email: 'sarah@medlearn.ai',
    track: 'NEET PG',
    role: UserRole.student,
    streakDays: 15,
    weakTopics: ['Cardiac cycle', 'Ventilator settings', 'Acid-base disorders'],
    strongTopics: ['Neuroanatomy', 'Antibiotics', 'Inflammation'],
  );

  static const admin = UserProfile(
    id: 'admin-1',
    fullName: 'MedLearn Admin',
    email: 'admin@medlearn.ai',
    track: 'MBBS',
    role: UserRole.admin,
    streakDays: 0,
    weakTopics: [],
    strongTopics: [],
  );

  static final credentials = <String, String>{
    student.email: 'Password@123',
    admin.email: 'Admin@123',
  };

  static final courses = <Course>[
    const Course(
      id: 'course-cardiology',
      title: 'Clinical Cardiology Masterclass',
      description: 'High-yield cardiovascular medicine for MBBS, NEET PG, and internship prep.',
      subject: 'Medicine',
      educator: 'Dr. Sarah Jenkins',
      durationHours: 32,
      progressPercent: 68,
      difficulty: 'Hard',
      tags: ['ECG', 'Heart failure', 'Valvular disease'],
      heroIcon: Icons.favorite_rounded,
    ),
    const Course(
      id: 'course-neuro',
      title: 'Advanced Neuroanatomy',
      description: 'Editorial, image-rich neuroanatomy built for strong concept retention.',
      subject: 'Anatomy',
      educator: 'Dr. Michael Chen',
      durationHours: 24,
      progressPercent: 15,
      difficulty: 'Medium',
      tags: ['Cranial nerves', 'Lesion maps', 'Clinical signs'],
      heroIcon: Icons.psychology_alt_rounded,
    ),
    const Course(
      id: 'course-pathology',
      title: 'Pathology Rapid Revision',
      description: 'Fast exam-driven pathology review with AI remediation loops.',
      subject: 'Pathology',
      educator: 'Dr. Priya Menon',
      durationHours: 18,
      progressPercent: 52,
      difficulty: 'Medium',
      tags: ['Inflammation', 'Neoplasia', 'Systemic pathology'],
      heroIcon: Icons.biotech_rounded,
    ),
  ];

  static final modules = <CourseModule>[
    const CourseModule(
      id: 'module-ecg',
      courseId: 'course-cardiology',
      title: 'ECG Interpretation Essentials',
      summary: 'Systematic rhythm interpretation, axis, intervals, and ischemia patterns.',
      durationMinutes: 74,
      completionPercent: 100,
      kind: ContentKind.video,
    ),
    const CourseModule(
      id: 'module-heart-failure',
      courseId: 'course-cardiology',
      title: 'Heart Failure & Hemodynamics',
      summary: 'Forward failure, congestion, compensated states, and therapy ladders.',
      durationMinutes: 96,
      completionPercent: 64,
      kind: ContentKind.pdf,
    ),
    const CourseModule(
      id: 'module-cranial',
      courseId: 'course-neuro',
      title: 'Cranial Nerves Deep Dive',
      summary: 'Nuclei, lesions, reflexes, and clinical pearls.',
      durationMinutes: 82,
      completionPercent: 40,
      kind: ContentKind.video,
    ),
    const CourseModule(
      id: 'module-inflammation',
      courseId: 'course-pathology',
      title: 'Inflammation & Repair',
      summary: 'Mediators, acute vs chronic inflammation, repair sequence, and exam traps.',
      durationMinutes: 68,
      completionPercent: 75,
      kind: ContentKind.pdf,
    ),
  ];

  static final books = <LibraryBook>[
    const LibraryBook(
      id: 'book-grays',
      title: "Gray's Anatomy",
      author: 'Susan Standring',
      category: 'Pre-Clinical',
      edition: '42nd Edition',
      summary: 'Authoritative anatomy reference with clinical integration.',
      tags: ['Core', 'Classic', 'Anatomy'],
    ),
    const LibraryBook(
      id: 'book-guyton',
      title: 'Guyton and Hall Textbook of Medical Physiology',
      author: 'John E. Hall',
      category: 'Pre-Clinical',
      edition: '14th Edition',
      summary: 'Gold standard physiology text for fundamentals and exams.',
      tags: ['Gold Standard', 'Physiology'],
    ),
    const LibraryBook(
      id: 'book-harrison',
      title: "Harrison's Principles of Internal Medicine",
      author: 'J. Larry Jameson',
      category: 'Clinical',
      edition: '21st Edition',
      summary: 'Comprehensive medicine text with system-wise disease reviews.',
      tags: ['Medicine', 'Clinical'],
    ),
  ];

  static final quizzes = <QuizSummary>[
    const QuizSummary(
      id: 'quiz-cardiology',
      title: 'Cardiovascular Systems Drill',
      description: 'Timed practice focused on cardiology concepts and clinical reasoning.',
      subject: 'Medicine',
      examTrack: 'NEET PG',
      durationMinutes: 85,
      totalQuestions: 6,
      topicFocus: ['Cardiac cycle', 'Heart sounds', 'Shock', 'Valvular disease'],
    ),
    const QuizSummary(
      id: 'quiz-pathology',
      title: 'Inflammation & Repair Sprint',
      description: 'Rapid pathology revision with explanation-first feedback.',
      subject: 'Pathology',
      examTrack: 'MBBS',
      durationMinutes: 35,
      totalQuestions: 4,
      topicFocus: ['Inflammation', 'Mediators', 'Repair'],
    ),
    const QuizSummary(
      id: 'quiz-pulm',
      title: 'USMLE Pulmonology High-Yield MCQs',
      description: 'Step-style questions on pneumonia, ARDS, and respiratory support.',
      subject: 'Medicine',
      examTrack: 'USMLE',
      durationMinutes: 45,
      totalQuestions: 4,
      topicFocus: ['Pneumonia', 'ARDS', 'Ventilator settings'],
    ),
  ];

  static final questions = <QuizQuestion>[
    QuizQuestion(
      id: 'q1',
      quizId: 'quiz-cardiology',
      subject: 'Medicine',
      topic: 'Cardiac cycle',
      prompt: 'Which of the following events occurs during isovolumetric contraction?',
      explanation: 'Both mitral and aortic valves are closed, so pressure rises with no volume change.',
      correctOptionId: 'q1-b',
      options: const [
        QuizOption(id: 'q1-a', label: 'A', text: 'Rapid ventricular filling'),
        QuizOption(id: 'q1-b', label: 'B', text: 'Rise in ventricular pressure at constant volume'),
        QuizOption(id: 'q1-c', label: 'C', text: 'Opening of semilunar valves'),
        QuizOption(id: 'q1-d', label: 'D', text: 'Atrial contraction'),
      ],
    ),
    QuizQuestion(
      id: 'q2',
      quizId: 'quiz-cardiology',
      subject: 'Medicine',
      topic: 'Valvular disease',
      prompt: 'A mid-diastolic murmur with opening snap is most suggestive of:',
      explanation: 'The classic auscultatory finding is mitral stenosis.',
      correctOptionId: 'q2-a',
      options: const [
        QuizOption(id: 'q2-a', label: 'A', text: 'Mitral stenosis'),
        QuizOption(id: 'q2-b', label: 'B', text: 'Aortic regurgitation'),
        QuizOption(id: 'q2-c', label: 'C', text: 'Mitral regurgitation'),
        QuizOption(id: 'q2-d', label: 'D', text: 'Aortic stenosis'),
      ],
    ),
    QuizQuestion(
      id: 'q3',
      quizId: 'quiz-cardiology',
      subject: 'Medicine',
      topic: 'Shock',
      prompt: 'The most likely hemodynamic profile in septic shock is:',
      explanation: 'Septic shock typically presents with low SVR and high cardiac output in the warm phase.',
      correctOptionId: 'q3-c',
      options: const [
        QuizOption(id: 'q3-a', label: 'A', text: 'High SVR, low cardiac output'),
        QuizOption(id: 'q3-b', label: 'B', text: 'High SVR, high cardiac output'),
        QuizOption(id: 'q3-c', label: 'C', text: 'Low SVR, high cardiac output'),
        QuizOption(id: 'q3-d', label: 'D', text: 'Normal SVR, low preload'),
      ],
    ),
    QuizQuestion(
      id: 'q4',
      quizId: 'quiz-cardiology',
      subject: 'Medicine',
      topic: 'Heart sounds',
      prompt: 'A fixed split S2 is classically associated with:',
      explanation: 'Atrial septal defect causes fixed splitting of the second heart sound.',
      correctOptionId: 'q4-d',
      options: const [
        QuizOption(id: 'q4-a', label: 'A', text: 'Pulmonary hypertension'),
        QuizOption(id: 'q4-b', label: 'B', text: 'Aortic stenosis'),
        QuizOption(id: 'q4-c', label: 'C', text: 'Mitral valve prolapse'),
        QuizOption(id: 'q4-d', label: 'D', text: 'Atrial septal defect'),
      ],
    ),
    QuizQuestion(
      id: 'q5',
      quizId: 'quiz-pulm',
      subject: 'Medicine',
      topic: 'Pneumonia',
      prompt: 'The most common cause of community-acquired pneumonia is:',
      explanation: 'Streptococcus pneumoniae remains the classic answer for typical CAP.',
      correctOptionId: 'q5-a',
      options: const [
        QuizOption(id: 'q5-a', label: 'A', text: 'Streptococcus pneumoniae'),
        QuizOption(id: 'q5-b', label: 'B', text: 'Mycoplasma pneumoniae'),
        QuizOption(id: 'q5-c', label: 'C', text: 'Haemophilus influenzae'),
        QuizOption(id: 'q5-d', label: 'D', text: 'Staphylococcus aureus'),
      ],
    ),
    QuizQuestion(
      id: 'q6',
      quizId: 'quiz-pulm',
      subject: 'Medicine',
      topic: 'ARDS',
      prompt: 'A key pathologic feature of ARDS is:',
      explanation: 'Diffuse alveolar damage with hyaline membrane formation defines ARDS.',
      correctOptionId: 'q6-b',
      options: const [
        QuizOption(id: 'q6-a', label: 'A', text: 'Pleural fibrosis'),
        QuizOption(id: 'q6-b', label: 'B', text: 'Diffuse alveolar damage'),
        QuizOption(id: 'q6-c', label: 'C', text: 'Bronchial smooth muscle hypertrophy'),
        QuizOption(id: 'q6-d', label: 'D', text: 'Caseating granulomas'),
      ],
    ),
    QuizQuestion(
      id: 'q7',
      quizId: 'quiz-pathology',
      subject: 'Pathology',
      topic: 'Inflammation',
      prompt: 'The first cells to arrive in acute inflammation are usually:',
      explanation: 'Neutrophils dominate the early phase of acute inflammation.',
      correctOptionId: 'q7-a',
      options: const [
        QuizOption(id: 'q7-a', label: 'A', text: 'Neutrophils'),
        QuizOption(id: 'q7-b', label: 'B', text: 'Lymphocytes'),
        QuizOption(id: 'q7-c', label: 'C', text: 'Eosinophils'),
        QuizOption(id: 'q7-d', label: 'D', text: 'Fibroblasts'),
      ],
    ),
    QuizQuestion(
      id: 'q8',
      quizId: 'quiz-pathology',
      subject: 'Pathology',
      topic: 'Repair',
      prompt: 'Granulation tissue is characterized by:',
      explanation: 'Granulation tissue contains proliferating capillaries and fibroblasts.',
      correctOptionId: 'q8-d',
      options: const [
        QuizOption(id: 'q8-a', label: 'A', text: 'Dense collagen and scarce vessels'),
        QuizOption(id: 'q8-b', label: 'B', text: 'Hyalinized scar only'),
        QuizOption(id: 'q8-c', label: 'C', text: 'Caseous necrosis'),
        QuizOption(id: 'q8-d', label: 'D', text: 'New capillaries and fibroblasts'),
      ],
    ),
  ];

  static final recommendations = <RecommendationItem>[
    const RecommendationItem(
      id: 'rec-1',
      title: 'Rebuild your cardiac cycle foundation',
      description: 'You miss pressure-volume and valve timing questions under time pressure.',
      topic: 'Cardiac cycle',
      priorityLabel: 'High priority',
    ),
    const RecommendationItem(
      id: 'rec-2',
      title: 'Schedule a 20-minute ventilator revision',
      description: 'Respiratory support questions are trending below your baseline.',
      topic: 'Ventilator settings',
      priorityLabel: 'Medium priority',
    ),
    const RecommendationItem(
      id: 'rec-3',
      title: 'Lean into neuroanatomy momentum',
      description: 'Convert your strongest subject into spaced revision points this week.',
      topic: 'Neuroanatomy',
      priorityLabel: 'Low priority',
    ),
  ];

  static final notifications = <NotificationItem>[
    const NotificationItem(
      title: 'Mock NEET PG Simulation',
      message: 'Your full-length simulation starts Saturday at 9:00 AM.',
      relativeTime: '2h ago',
    ),
    const NotificationItem(
      title: 'AI recommendation ready',
      message: 'Cardiac cycle and ventilator settings were added to your focus stack.',
      relativeTime: 'Today',
    ),
  ];

  static final insights = <PerformanceInsight>[
    const PerformanceInsight(label: 'Accuracy', value: '78%', trend: '+6% week-on-week'),
    const PerformanceInsight(label: 'Study hours', value: '12.4', trend: '+8% this week'),
    const PerformanceInsight(label: 'Quiz velocity', value: '42s', trend: '5s faster'),
    const PerformanceInsight(label: 'Consistency', value: '88%', trend: '+12% month-on-month'),
  ];

  static List<CourseModule> modulesForCourse(String courseId) {
    return modules.where((module) => module.courseId == courseId).toList();
  }

  static List<QuizQuestion> questionsForQuiz(String quizId) {
    return questions.where((question) => question.quizId == quizId).toList();
  }

  static List<StudyTask> seedTasks(String userId) {
    final now = DateTime.now();
    return [
      StudyTask(
        id: 'task-1',
        userId: userId,
        title: 'Review Physiology',
        description: 'Cardiac cycle and pressure-volume loops',
        scheduledFor: DateTime(now.year, now.month, now.day, 9, 0),
        category: TaskCategory.revision,
        status: TaskStatus.todo,
      ),
      StudyTask(
        id: 'task-2',
        userId: userId,
        title: '15 MCQs in Pathology',
        description: 'Focus on neoplasia and inflammation',
        scheduledFor: DateTime(now.year, now.month, now.day, 11, 0),
        category: TaskCategory.quiz,
        status: TaskStatus.inProgress,
      ),
      StudyTask(
        id: 'task-3',
        userId: userId,
        title: 'Watch ECG Lecture',
        description: 'Module 4: arrhythmias and conduction blocks',
        scheduledFor: DateTime(now.year, now.month, now.day, 14, 0),
        category: TaskCategory.course,
        status: TaskStatus.todo,
      ),
    ];
  }

  static List<QuizAttempt> seedAttempts(String userId) {
    return [
      QuizAttempt(
        id: 'attempt-1',
        quizId: 'quiz-cardiology',
        userId: userId,
        score: 83,
        accuracy: 83,
        durationSeconds: 3840,
        submittedAt: DateTime.now().subtract(const Duration(days: 3)),
        weakTopics: const ['Cardiac cycle'],
        strongTopics: const ['Valvular disease', 'Shock'],
      ),
    ];
  }

  static List<ChatMessage> seedMessages() {
    return [
      ChatMessage(
        id: 'm1',
        text: 'You were strongest in anatomy this week. If we focus on cardiac cycle today, I can generate a 25-minute revision block plus 10 custom MCQs.',
        isUser: false,
        timestamp: DateTime.now().subtract(const Duration(minutes: 20)),
      ),
      ChatMessage(
        id: 'm2',
        text: 'Why is isovolumetric contraction tested so often?',
        isUser: true,
        timestamp: DateTime.now().subtract(const Duration(minutes: 18)),
      ),
      ChatMessage(
        id: 'm3',
        text: 'Because it links valve state, pressure change, and volume change in one step. It is a favorite integration point for physiology questions.',
        isUser: false,
        timestamp: DateTime.now().subtract(const Duration(minutes: 17)),
      ),
    ];
  }

  static UserProgress progressFor(UserProfile user, List<QuizAttempt> attempts) {
    final relevantAttempts = attempts.where((attempt) => attempt.userId == user.id).toList();
    final averageAccuracy = relevantAttempts.isEmpty
        ? 0
        : (relevantAttempts.map((attempt) => attempt.accuracy).reduce((a, b) => a + b) / relevantAttempts.length).round();

    return UserProgress(
      completionPercent: user.role == UserRole.admin ? 100 : 72,
      hoursLearned: user.role == UserRole.admin ? 0 : 126.0,
      quizzesTaken: relevantAttempts.length,
      averageAccuracy: averageAccuracy,
      weakTopics: user.weakTopics,
      strongTopics: user.strongTopics,
      insights: insights,
    );
  }

  static UserProfile? authenticate(String email, String password) {
    final normalized = email.trim().toLowerCase();
    final expected = credentials[normalized];

    if (expected == null || expected != password) {
      return null;
    }

    if (normalized == student.email) {
      return student;
    }

    if (normalized == admin.email) {
      return admin;
    }

    return null;
  }
}
