import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/api_client.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class QuizHubPage extends ConsumerStatefulWidget {
  const QuizHubPage({super.key});

  @override
  ConsumerState<QuizHubPage> createState() => _QuizHubPageState();
}

class _QuizHubPageState extends ConsumerState<QuizHubPage> {
  List<QuizSummary>? _quizzes;

  @override
  void initState() {
    super.initState();
    _loadQuizzes();
  }

  Future<void> _loadQuizzes() async {
    final live = await MedLearnApi.getQuizzes();
    if (mounted) setState(() => _quizzes = live);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;
    final attempts = state.attempts.where((a) => a.userId == user.id).toList();
    final averageAccuracy = attempts.isEmpty
        ? 78
        : (attempts.map((a) => a.accuracy).reduce((a, b) => a + b) / attempts.length).round();
    final quizzes = _quizzes ?? [];

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
      children: [
        EditorialCard(
          padding: const EdgeInsets.all(22),
          gradient: const LinearGradient(
            colors: [
              Color(0xFF25183F),
              Color(0xFF12354A),
              MedlearnColors.primary,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderColor: Colors.transparent,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const TagChip(
                label: 'Quiz engine',
                icon: Icons.timer_rounded,
                backgroundColor: Color.fromRGBO(255, 255, 255, 0.14),
                foregroundColor: Colors.white,
              ),
              const SizedBox(height: 16),
              Text(
                'Practice with timed exams, tight navigation, and AI-backed review loops.',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
              ),
              const SizedBox(height: 12),
              Text(
                'MedLearn tracks score, weak topics, and recovery patterns after every attempt so the next quiz gets smarter.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
              ),
              const SizedBox(height: 18),
              GlassCard(
                child: Row(
                  children: [
                    ScoreRing(score: averageAccuracy, size: 120),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Recent performance',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Accuracy is stable, but ${user.weakTopics.take(2).join(' and ')} still need deliberate repetition.',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: MedlearnColors.onSurfaceVariant,
                                ),
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              TagChip(
                                label: '${attempts.length} attempts',
                                backgroundColor: MedlearnColors.surfaceTint,
                                foregroundColor: MedlearnColors.primary,
                              ),
                              TagChip(
                                label: '${DemoCatalog.quizzes.length} active sets',
                                backgroundColor: MedlearnColors.surfaceTint,
                                foregroundColor: MedlearnColors.primary,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        if (_quizzes == null)
          const Padding(
            padding: EdgeInsets.all(32),
            child: Center(child: CircularProgressIndicator()),
          )
        else ...[
        const SectionHeader(eyebrow: 'Available quizzes', title: 'Start a session'),
        const SizedBox(height: 14),
        ...quizzes.map(
          (quiz) => Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: _QuizCard(quiz: quiz),
          ),
        ),
        const SizedBox(height: 8),
        const SectionHeader(eyebrow: 'Attempt history', title: 'Recent results'),
        const SizedBox(height: 14),
        if (attempts.isEmpty)
          const EmptyStateCard(
            title: 'No attempts yet',
            message: 'Start a quiz to populate your mobile exam history.',
            icon: Icons.quiz_rounded,
          )
        else
          ...attempts.reversed.map(
            (attempt) {
              final quiz = quizzes.firstWhere(
                (q) => q.id == attempt.quizId,
                orElse: () => quizzes.isNotEmpty ? quizzes.first : DemoCatalog.quizzes.first,
              );
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: InkWell(
                  borderRadius: BorderRadius.circular(30),
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => QuizResultPage(quiz: quiz, attempt: attempt),
                    ),
                  ),
                  child: EditorialCard(
                    padding: const EdgeInsets.all(18),
                    color: Colors.white.withValues(alpha: 0.88),
                    child: Row(
                      children: [
                        Container(
                          height: 48,
                          width: 48,
                          decoration: BoxDecoration(
                            color: MedlearnColors.surfaceTint,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: Center(
                            child: Text(
                              '${attempt.score}',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(color: MedlearnColors.primary),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(quiz.title, style: Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 4),
                              Text(
                                'Accuracy ${attempt.accuracy}% · ${DateFormat('d MMM').format(attempt.submittedAt)}',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right_rounded),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ], // end of _quizzes != null
      ],
    );
  }
}

class QuizAttemptPage extends ConsumerStatefulWidget {
  const QuizAttemptPage({
    super.key,
    required this.quiz,
  });

  final QuizSummary quiz;

  @override
  ConsumerState<QuizAttemptPage> createState() => _QuizAttemptPageState();
}

class _QuizAttemptPageState extends ConsumerState<QuizAttemptPage> {
  late final List<QuizQuestion> _questions;
  late final Map<String, String?> _answers;
  late final Map<String, Set<String>> _eliminated;
  final Set<String> _markedForReview = <String>{};
  late int _remainingSeconds;
  int _currentIndex = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _questions = DemoCatalog.questionsForQuiz(widget.quiz.id);
    _answers = {for (final question in _questions) question.id: null};
    _eliminated = {for (final question in _questions) question.id: <String>{}};
    _remainingSeconds = widget.quiz.durationMinutes * 60;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_remainingSeconds <= 0) {
        timer.cancel();
        _submit();
        return;
      }
      setState(() => _remainingSeconds -= 1);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _submit() {
    _timer?.cancel();
    final user = ref.read(appControllerProvider).currentUser ?? DemoCatalog.student;
    final correctCount = _questions.where((question) => _answers[question.id] == question.correctOptionId).length;
    final score = ((correctCount / _questions.length) * 100).round();

    final topicStats = <String, List<int>>{};
    for (final question in _questions) {
      final bucket = topicStats.putIfAbsent(question.topic, () => [0, 0]);
      bucket[1] += 1;
      if (_answers[question.id] == question.correctOptionId) {
        bucket[0] += 1;
      }
    }

    final weakTopics = <String>[];
    final strongTopics = <String>[];
    topicStats.forEach((topic, stats) {
      final accuracy = stats[1] == 0 ? 0 : (stats[0] / stats[1]) * 100;
      if (accuracy < 70) weakTopics.add(topic);
      if (accuracy >= 85) strongTopics.add(topic);
    });

    final attempt = QuizAttempt(
      id: 'attempt-${DateTime.now().millisecondsSinceEpoch}',
      quizId: widget.quiz.id,
      userId: user.id,
      score: score,
      accuracy: score,
      durationSeconds: widget.quiz.durationMinutes * 60 - _remainingSeconds,
      submittedAt: DateTime.now(),
      weakTopics: weakTopics,
      strongTopics: strongTopics,
    );

    ref.read(appControllerProvider.notifier).storeAttempt(attempt);

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => QuizResultPage(quiz: widget.quiz, attempt: attempt)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final question = _questions[_currentIndex];
    final currentEliminated = _eliminated[question.id] ?? <String>{};
    final currentAnswer = _answers[question.id];
    final answeredCount = _answers.values.where((answer) => answer != null).length;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.quiz.title),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: MedlearnColors.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: MedlearnColors.outline),
            ),
            child: Center(
              child: Text(
                _formatSeconds(_remainingSeconds),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: MedlearnColors.primary,
                      fontSize: 16,
                    ),
              ),
            ),
          ),
        ],
      ),
      body: MedScaffoldBackground(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          children: [
            EditorialCard(
              padding: const EdgeInsets.all(18),
              color: Colors.white.withValues(alpha: 0.9),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Question ${_currentIndex + 1} of ${_questions.length}',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      TagChip(
                        label: '${_markedForReview.length} marked',
                        icon: Icons.flag_outlined,
                        backgroundColor: MedlearnColors.accentSoft,
                        foregroundColor: MedlearnColors.primaryDark,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: (_currentIndex + 1) / _questions.length,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(999),
                    backgroundColor: MedlearnColors.surfaceHigh,
                    color: MedlearnColors.primary,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      TagChip(
                        label: '$answeredCount answered',
                        backgroundColor: MedlearnColors.surfaceTint,
                        foregroundColor: MedlearnColors.primary,
                      ),
                      TagChip(
                        label: '${_questions.length - answeredCount} remaining',
                        backgroundColor: Colors.white,
                        foregroundColor: MedlearnColors.onSurfaceVariant,
                      ),
                      TagChip(
                        label: widget.quiz.examTrack,
                        backgroundColor: Colors.white,
                        foregroundColor: MedlearnColors.onSurfaceVariant,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            EditorialCard(
              padding: const EdgeInsets.all(18),
              color: MedlearnColors.surfaceLow,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Question palette',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: MedlearnColors.primary,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2.0,
                        ),
                  ),
                  const SizedBox(height: 14),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: List.generate(_questions.length, (index) {
                      final item = _questions[index];
                      final isCurrent = index == _currentIndex;
                      final isMarked = _markedForReview.contains(item.id);
                      final isAnswered = _answers[item.id] != null;
                      final background = isCurrent
                          ? MedlearnColors.primary
                          : isMarked
                              ? MedlearnColors.accentSoft
                              : isAnswered
                                  ? MedlearnColors.tertiarySoft
                                  : Colors.white;
                      final foreground = isCurrent
                          ? Colors.white
                          : isMarked
                              ? MedlearnColors.primaryDark
                              : isAnswered
                                  ? MedlearnColors.tertiary
                                  : MedlearnColors.onSurfaceVariant;

                      return GestureDetector(
                        onTap: () => setState(() => _currentIndex = index),
                        child: Container(
                          height: 42,
                          width: 42,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: background,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isCurrent ? Colors.transparent : MedlearnColors.outline,
                            ),
                          ),
                          child: Text(
                            '${index + 1}',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: foreground,
                                  fontWeight: FontWeight.w800,
                                ),
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'AI GUIDANCE',
                    style: TextStyle(
                      color: MedlearnColors.primary,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.0,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Focus on mechanism plus clinical context. Rule out the classic answer before reaching for edge-case distractors.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            EditorialCard(
              padding: const EdgeInsets.all(20),
              color: Colors.white.withValues(alpha: 0.92),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TagChip(
                    label: '${question.subject} · ${question.topic}',
                    icon: Icons.local_library_rounded,
                    backgroundColor: MedlearnColors.surfaceTint,
                    foregroundColor: MedlearnColors.primary,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    question.prompt,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontSize: 30),
                  ),
                  const SizedBox(height: 18),
                  ...question.options.where((option) => !currentEliminated.contains(option.id)).map(
                    (option) {
                      final selected = currentAnswer == option.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(26),
                          onTap: () => setState(() => _answers[question.id] = option.id),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              gradient: selected
                                  ? const LinearGradient(
                                      colors: [
                                        MedlearnColors.primaryFixed,
                                        Colors.white,
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    )
                                  : null,
                              color: selected ? null : MedlearnColors.surfaceLow,
                              borderRadius: BorderRadius.circular(26),
                              border: Border.all(
                                color: selected ? MedlearnColors.primary : MedlearnColors.outline,
                                width: selected ? 1.4 : 1,
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  height: 42,
                                  width: 42,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: selected ? MedlearnColors.primary : Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Text(
                                    option.label,
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                          color: selected ? Colors.white : MedlearnColors.onSurfaceVariant,
                                        ),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Text(
                                    option.text,
                                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                          color: MedlearnColors.onSurface,
                                          fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                                        ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                TextButton(
                                  onPressed: () => setState(
                                    () => _eliminated[question.id] = {...currentEliminated, option.id},
                                  ),
                                  child: const Text('Eliminate'),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => setState(
                      () => _markedForReview.contains(question.id)
                          ? _markedForReview.remove(question.id)
                          : _markedForReview.add(question.id),
                    ),
                    icon: const Icon(Icons.flag_outlined),
                    label: Text(_markedForReview.contains(question.id) ? 'Unmark review' : 'Mark for review'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _currentIndex == 0 ? null : () => setState(() => _currentIndex -= 1),
                    child: const Text('Previous'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _currentIndex == _questions.length - 1
                        ? _submit
                        : () => setState(() => _currentIndex += 1),
                    child: Text(_currentIndex == _questions.length - 1 ? 'Submit quiz' : 'Next question'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatSeconds(int seconds) {
    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final secs = seconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}

class QuizResultPage extends StatelessWidget {
  const QuizResultPage({
    super.key,
    required this.quiz,
    required this.attempt,
  });

  final QuizSummary quiz;
  final QuizAttempt attempt;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quiz result')),
      body: MedScaffoldBackground(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          children: [
            EditorialCard(
              padding: const EdgeInsets.all(22),
              gradient: const LinearGradient(
                colors: [MedlearnColors.primaryDark, MedlearnColors.primary, MedlearnColors.primaryContainer],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderColor: Colors.transparent,
              child: Column(
                children: [
                  const SizedBox(height: 4),
                  ScoreRing(
                    score: attempt.score,
                    textColor: Colors.white,
                    subtextColor: Colors.white70,
                    trackColor: Color.fromRGBO(255, 255, 255, 0.18),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    quiz.title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Accuracy ${attempt.accuracy}% · ${DateFormat('d MMM, hh:mm a').format(attempt.submittedAt)}',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white70),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 18),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    alignment: WrapAlignment.center,
                    children: [
                      _ResultPill(label: '${attempt.durationSeconds ~/ 60} min', caption: 'Time used'),
                      _ResultPill(label: '${attempt.strongTopics.length}', caption: 'Strong topics'),
                      _ResultPill(label: '${attempt.weakTopics.length}', caption: 'Review topics'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            const SectionHeader(eyebrow: 'Strong topics', title: 'What went well'),
            const SizedBox(height: 12),
            ...(attempt.strongTopics.isEmpty
                ? [
                    const EmptyStateCard(
                      title: 'No standout topics yet',
                      message: 'Keep taking topic-focused quizzes to build a stronger signal.',
                      icon: Icons.trending_up_rounded,
                    ),
                  ]
                : attempt.strongTopics.map(
                    (topic) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: EditorialCard(
                        padding: const EdgeInsets.all(16),
                        color: MedlearnColors.tertiarySoft,
                        borderColor: Colors.transparent,
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded, color: MedlearnColors.tertiary),
                            const SizedBox(width: 10),
                            Expanded(child: Text(topic, style: Theme.of(context).textTheme.titleMedium)),
                          ],
                        ),
                      ),
                    ),
                  )),
            const SizedBox(height: 18),
            const SectionHeader(eyebrow: 'Review next', title: 'Weak topics'),
            const SizedBox(height: 12),
            ...(attempt.weakTopics.isEmpty
                ? [
                    const EmptyStateCard(
                      title: 'Balanced attempt',
                      message: 'This quiz did not reveal a weak topic below the review threshold.',
                      icon: Icons.auto_graph_rounded,
                    ),
                  ]
                : attempt.weakTopics.map(
                    (topic) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: EditorialCard(
                        padding: const EdgeInsets.all(16),
                        color: MedlearnColors.errorSoft,
                        borderColor: Colors.transparent,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              topic,
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(color: MedlearnColors.error),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Recommended next step: do a short concept review, then retake a focused quiz on this topic.',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.replay_rounded),
                label: const Text('Back to quiz hub'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuizCard extends StatelessWidget {
  const _QuizCard({
    required this.quiz,
  });

  final QuizSummary quiz;

  @override
  Widget build(BuildContext context) {
    return EditorialCard(
      padding: const EdgeInsets.all(18),
      color: Colors.white.withValues(alpha: 0.88),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    TagChip(
                      label: quiz.examTrack,
                      icon: Icons.workspace_premium_rounded,
                      backgroundColor: MedlearnColors.surfaceTint,
                      foregroundColor: MedlearnColors.primary,
                    ),
                    TagChip(
                      label: quiz.subject,
                      backgroundColor: Colors.white,
                    ),
                  ],
                ),
              ),
              Container(
                height: 52,
                width: 52,
                decoration: BoxDecoration(
                  color: MedlearnColors.surfaceTint,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Icon(Icons.quiz_rounded, color: MedlearnColors.primary),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(quiz.title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text(
            quiz.description,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              TagChip(
                label: '${quiz.totalQuestions} questions',
                backgroundColor: Colors.white,
              ),
              TagChip(
                label: '${quiz.durationMinutes} minutes',
                backgroundColor: Colors.white,
              ),
              ...quiz.topicFocus.take(2).map(
                (topic) => TagChip(
                  label: topic,
                  backgroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => QuizAttemptPage(quiz: quiz)),
              ),
              child: Text('Start ${quiz.totalQuestions}-question quiz'),
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultPill extends StatelessWidget {
  const _ResultPill({
    required this.label,
    required this.caption,
  });

  final String label;
  final String caption;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 4),
          Text(
            caption,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
