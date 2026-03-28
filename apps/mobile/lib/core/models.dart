import 'package:flutter/material.dart';

enum UserRole { student, admin }

enum TaskStatus { todo, inProgress, done }

enum TaskCategory { course, quiz, revision, ai }

enum ContentKind { video, pdf }

class UserProfile {
  const UserProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.track,
    required this.role,
    required this.streakDays,
    required this.weakTopics,
    required this.strongTopics,
  });

  final String id;
  final String fullName;
  final String email;
  final String track;
  final UserRole role;
  final int streakDays;
  final List<String> weakTopics;
  final List<String> strongTopics;
}

class RecommendationItem {
  const RecommendationItem({
    required this.id,
    required this.title,
    required this.description,
    required this.topic,
    required this.priorityLabel,
  });

  final String id;
  final String title;
  final String description;
  final String topic;
  final String priorityLabel;
}

class NotificationItem {
  const NotificationItem({
    required this.title,
    required this.message,
    required this.relativeTime,
  });

  final String title;
  final String message;
  final String relativeTime;
}

class Course {
  const Course({
    required this.id,
    required this.title,
    required this.description,
    required this.section,
    required this.subject,
    required this.educator,
    required this.durationHours,
    required this.progressPercent,
    required this.difficulty,
    required this.tags,
    required this.heroIcon,
  });

  final String id;
  final String title;
  final String description;
  final String section;
  final String subject;
  final String educator;
  final int durationHours;
  final int progressPercent;
  final String difficulty;
  final List<String> tags;
  final IconData heroIcon;
}

class CourseModule {
  const CourseModule({
    required this.id,
    required this.courseId,
    required this.title,
    required this.summary,
    required this.durationMinutes,
    required this.completionPercent,
    required this.kind,
  });

  final String id;
  final String courseId;
  final String title;
  final String summary;
  final int durationMinutes;
  final int completionPercent;
  final ContentKind kind;
}

class LibraryBook {
  const LibraryBook({
    required this.id,
    required this.title,
    required this.author,
    required this.category,
    required this.subject,
    required this.edition,
    required this.summary,
    required this.tags,
  });

  final String id;
  final String title;
  final String author;
  final String category;
  final String subject;
  final String edition;
  final String summary;
  final List<String> tags;
}

class QuizSummary {
  const QuizSummary({
    required this.id,
    required this.title,
    required this.description,
    required this.subject,
    required this.examTrack,
    required this.durationMinutes,
    required this.totalQuestions,
    required this.topicFocus,
  });

  final String id;
  final String title;
  final String description;
  final String subject;
  final String examTrack;
  final int durationMinutes;
  final int totalQuestions;
  final List<String> topicFocus;
}

class QuizOption {
  const QuizOption({
    required this.id,
    required this.label,
    required this.text,
  });

  final String id;
  final String label;
  final String text;
}

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.quizId,
    required this.subject,
    required this.topic,
    required this.prompt,
    required this.explanation,
    required this.correctOptionId,
    required this.options,
  });

  final String id;
  final String quizId;
  final String subject;
  final String topic;
  final String prompt;
  final String explanation;
  final String correctOptionId;
  final List<QuizOption> options;
}

class QuizAttempt {
  const QuizAttempt({
    required this.id,
    required this.quizId,
    required this.userId,
    required this.score,
    required this.accuracy,
    required this.durationSeconds,
    required this.submittedAt,
    required this.weakTopics,
    required this.strongTopics,
  });

  final String id;
  final String quizId;
  final String userId;
  final int score;
  final int accuracy;
  final int durationSeconds;
  final DateTime submittedAt;
  final List<String> weakTopics;
  final List<String> strongTopics;
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
  });

  final String id;
  final String text;
  final bool isUser;
  final DateTime timestamp;
}

class PerformanceInsight {
  const PerformanceInsight({
    required this.label,
    required this.value,
    required this.trend,
  });

  final String label;
  final String value;
  final String trend;
}

class StudyTask {
  const StudyTask({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.scheduledFor,
    required this.category,
    required this.status,
  });

  final String id;
  final String userId;
  final String title;
  final String description;
  final DateTime scheduledFor;
  final TaskCategory category;
  final TaskStatus status;

  StudyTask copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    DateTime? scheduledFor,
    TaskCategory? category,
    TaskStatus? status,
  }) {
    return StudyTask(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      scheduledFor: scheduledFor ?? this.scheduledFor,
      category: category ?? this.category,
      status: status ?? this.status,
    );
  }
}

class UserProgress {
  const UserProgress({
    required this.completionPercent,
    required this.hoursLearned,
    required this.quizzesTaken,
    required this.averageAccuracy,
    required this.weakTopics,
    required this.strongTopics,
    required this.insights,
  });

  final int completionPercent;
  final double hoursLearned;
  final int quizzesTaken;
  final int averageAccuracy;
  final List<String> weakTopics;
  final List<String> strongTopics;
  final List<PerformanceInsight> insights;
}
