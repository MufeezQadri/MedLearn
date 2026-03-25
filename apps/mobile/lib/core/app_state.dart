import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'mock_data.dart';
import 'models.dart';

class MedlearnAppState {
  const MedlearnAppState({
    required this.currentUser,
    required this.attempts,
    required this.tasks,
    required this.messages,
    required this.notificationsEnabled,
    required this.plannerAiEnabled,
  });

  final UserProfile? currentUser;
  final List<QuizAttempt> attempts;
  final List<StudyTask> tasks;
  final List<ChatMessage> messages;
  final bool notificationsEnabled;
  final bool plannerAiEnabled;

  MedlearnAppState copyWith({
    UserProfile? currentUser,
    bool clearUser = false,
    List<QuizAttempt>? attempts,
    List<StudyTask>? tasks,
    List<ChatMessage>? messages,
    bool? notificationsEnabled,
    bool? plannerAiEnabled,
  }) {
    return MedlearnAppState(
      currentUser: clearUser ? null : currentUser ?? this.currentUser,
      attempts: attempts ?? this.attempts,
      tasks: tasks ?? this.tasks,
      messages: messages ?? this.messages,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      plannerAiEnabled: plannerAiEnabled ?? this.plannerAiEnabled,
    );
  }
}

class AppController extends StateNotifier<MedlearnAppState> {
  AppController()
      : super(
          MedlearnAppState(
            currentUser: null,
            attempts: DemoCatalog.seedAttempts(DemoCatalog.student.id),
            tasks: DemoCatalog.seedTasks(DemoCatalog.student.id),
            messages: DemoCatalog.seedMessages(),
            notificationsEnabled: true,
            plannerAiEnabled: true,
          ),
        );

  void signIn(UserProfile user) {
    state = state.copyWith(
      currentUser: user,
      tasks: DemoCatalog.seedTasks(user.id),
      attempts: user.role == UserRole.student ? DemoCatalog.seedAttempts(user.id) : const [],
      messages: DemoCatalog.seedMessages(),
    );
  }

  void signOut() {
    state = state.copyWith(clearUser: true);
  }

  void toggleNotifications() {
    state = state.copyWith(notificationsEnabled: !state.notificationsEnabled);
  }

  void togglePlannerAi() {
    state = state.copyWith(plannerAiEnabled: !state.plannerAiEnabled);
  }

  void addTask({
    required String title,
    required String description,
    required DateTime scheduledFor,
    required TaskCategory category,
  }) {
    final user = state.currentUser;
    if (user == null) return;

    final next = StudyTask(
      id: 'task-${DateTime.now().millisecondsSinceEpoch}',
      userId: user.id,
      title: title,
      description: description,
      scheduledFor: scheduledFor,
      category: category,
      status: TaskStatus.todo,
    );

    state = state.copyWith(tasks: [...state.tasks, next]..sort((a, b) => a.scheduledFor.compareTo(b.scheduledFor)));
  }

  void deleteTask(String taskId) {
    state = state.copyWith(tasks: state.tasks.where((task) => task.id != taskId).toList());
  }

  void appendAssistantExchange(String prompt) {
    final user = state.currentUser;
    final userMessage = ChatMessage(
      id: 'msg-user-${DateTime.now().millisecondsSinceEpoch}',
      text: prompt,
      isUser: true,
      timestamp: DateTime.now(),
    );

    final response = ChatMessage(
      id: 'msg-ai-${DateTime.now().microsecondsSinceEpoch}',
      text: _buildAssistantReply(user, prompt),
      isUser: false,
      timestamp: DateTime.now().add(const Duration(milliseconds: 300)),
    );

    state = state.copyWith(messages: [...state.messages, userMessage, response]);
  }

  void storeAttempt(QuizAttempt attempt) {
    final next = [...state.attempts, attempt]..sort((a, b) => b.submittedAt.compareTo(a.submittedAt));
    state = state.copyWith(attempts: next);
  }

  String _buildAssistantReply(UserProfile? user, String prompt) {
    final priorities = user?.weakTopics.take(2).join(' and ') ?? 'your weakest recent topics';

    if (prompt.toLowerCase().contains('plan')) {
      return 'I would anchor today around $priorities, then add one short quiz block and one retrieval-based revision cycle before sleep.';
    }

    return 'Focus on mechanism first, then the exam trap. Based on your profile, revisit $priorities and connect the concept to a clinical vignette before memorizing exceptions.';
  }
}

final appControllerProvider = StateNotifierProvider<AppController, MedlearnAppState>(
  (ref) => AppController(),
);
