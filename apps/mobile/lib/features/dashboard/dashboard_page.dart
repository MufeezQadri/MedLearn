import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({
    super.key,
    required this.onOpenCourses,
    required this.onOpenPlanner,
  });

  final VoidCallback? onOpenCourses;
  final VoidCallback? onOpenPlanner;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;
    final progress = DemoCatalog.progressFor(user, state.attempts);
    final tasks = state.tasks.where((task) => task.userId == user.id).take(3).toList();
    final firstName = user.fullName.replaceFirst('Dr. ', '').split(' ').first;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
      children: [
        EditorialCard(
          padding: const EdgeInsets.all(22),
          gradient: const LinearGradient(
            colors: [
              MedlearnColors.primaryDark,
              MedlearnColors.primary,
              MedlearnColors.primaryContainer,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderColor: Colors.transparent,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Wrap(
                runSpacing: 10,
                spacing: 10,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  TagChip(
                    label: user.track,
                    icon: Icons.workspace_premium_rounded,
                    backgroundColor: Colors.white.withValues(alpha: 0.14),
                    foregroundColor: Colors.white,
                  ),
                  TagChip(
                    label: '${user.streakDays} day streak',
                    icon: Icons.local_fire_department_rounded,
                    backgroundColor: Colors.white.withValues(alpha: 0.14),
                    foregroundColor: Colors.white,
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Text(
                'Good to see you, $firstName.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontSize: 34,
                      color: Colors.white,
                    ),
              ),
              const SizedBox(height: 10),
              Text(
                'Your next best move is a quick remediation loop around ${user.weakTopics.first} before you return to your strongest systems.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
              ),
              const SizedBox(height: 18),
              GlassCard(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 48,
                      width: 48,
                      decoration: BoxDecoration(
                        color: MedlearnColors.accentSoft,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: const Icon(Icons.auto_awesome_rounded, color: MedlearnColors.primaryDark),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'AI focus stack',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: MedlearnColors.primary,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.8,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            DemoCatalog.recommendations.first.title,
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            DemoCatalog.recommendations.first.description,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
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
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: MetricTile(
                label: 'Accuracy',
                value: '${progress.averageAccuracy}%',
                icon: Icons.analytics_rounded,
                meta: 'Quiz signal',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: MetricTile(
                label: 'Coverage',
                value: '${progress.completionPercent}%',
                icon: Icons.play_circle_outline_rounded,
                meta: 'Syllabus done',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: MetricTile(
                label: 'Quizzes',
                value: '${progress.quizzesTaken}',
                icon: Icons.quiz_outlined,
                meta: 'Attempts',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: EditorialCard(
                padding: const EdgeInsets.all(18),
                color: MedlearnColors.accentSoft,
                borderColor: Colors.transparent,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 42,
                      width: 42,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.schedule_rounded, color: MedlearnColors.primary),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      '12.4h',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontSize: 28),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Study time this week',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        const SectionHeader(eyebrow: 'Jump back in', title: 'Quick actions'),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _QuickActionCard(
                title: 'Continue course',
                subtitle: 'Resume cardiology modules',
                icon: Icons.play_arrow_rounded,
                color: MedlearnColors.surface,
                onTap: onOpenCourses,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _QuickActionCard(
                title: 'Open planner',
                subtitle: 'See today\'s revision flow',
                icon: Icons.event_note_rounded,
                color: MedlearnColors.surface,
                onTap: onOpenPlanner,
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        SectionHeader(
          eyebrow: 'Study planner',
          title: 'Today\'s AI schedule',
          action: TextButton(
            onPressed: onOpenPlanner,
            child: const Text('Open planner'),
          ),
        ),
        const SizedBox(height: 12),
        if (tasks.isEmpty)
          const EmptyStateCard(
            title: 'No study blocks for today',
            message: 'Open the planner to generate a fresh AI schedule.',
            icon: Icons.event_busy_rounded,
          )
        else
          ...tasks.map(
            (task) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _TaskCard(task: task),
            ),
          ),
        const SizedBox(height: 12),
        const SectionHeader(eyebrow: 'Continue learning', title: 'Recommended next'),
        const SizedBox(height: 12),
        ...DemoCatalog.courses.take(2).map(
          (course) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: EditorialCard(
              padding: const EdgeInsets.all(18),
              color: MedlearnColors.surface,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        height: 50,
                        width: 50,
                        decoration: BoxDecoration(
                          color: MedlearnColors.surfaceTint,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Icon(course.heroIcon, color: MedlearnColors.primary),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(course.title, style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 4),
                            Text(
                              '${course.subject} · ${course.educator}',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                            ),
                          ],
                        ),
                      ),
                      TagChip(
                        label: course.difficulty,
                        backgroundColor: MedlearnColors.surfaceTint,
                        foregroundColor: MedlearnColors.primary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    course.description,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                  ),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(
                    value: course.progressPercent / 100,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(999),
                    backgroundColor: MedlearnColors.surfaceHigh,
                    color: MedlearnColors.primary,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${course.progressPercent}% complete · ${course.durationHours} hours',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: MedlearnColors.primary),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        const SectionHeader(eyebrow: 'Inbox', title: 'Notifications'),
        const SizedBox(height: 12),
        ...DemoCatalog.notifications.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: EditorialCard(
              padding: const EdgeInsets.all(18),
              color: MedlearnColors.surfaceLow,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 42,
                    width: 42,
                    decoration: BoxDecoration(
                      color: MedlearnColors.surface,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.notifications_active_outlined, color: MedlearnColors.primary),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
                        const SizedBox(height: 6),
                        Text(
                          item.message,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    item.relativeTime,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: MedlearnColors.primary),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(30),
      onTap: onTap,
      child: EditorialCard(
        padding: const EdgeInsets.all(18),
        color: color,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 42,
              width: 42,
              decoration: BoxDecoration(
                color: MedlearnColors.surfaceTint,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: MedlearnColors.primary),
            ),
            const SizedBox(height: 18),
            Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
            const SizedBox(height: 6),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
            ),
          ],
        ),
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  const _TaskCard({
    required this.task,
  });

  final StudyTask task;

  @override
  Widget build(BuildContext context) {
    final statusLabel = task.status.name.replaceAll('inProgress', 'in progress');

    return EditorialCard(
      padding: const EdgeInsets.all(18),
      color: Colors.white.withValues(alpha: 0.9),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                height: 44,
                width: 44,
                decoration: BoxDecoration(
                  color: MedlearnColors.surfaceTint,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(_iconForTask(task.category), color: MedlearnColors.primary),
              ),
              Container(
                width: 2,
                height: 56,
                margin: const EdgeInsets.symmetric(vertical: 6),
                color: MedlearnColors.outline,
              ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DateFormat('hh:mm a').format(task.scheduledFor),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: MedlearnColors.primary,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.8,
                      ),
                ),
                const SizedBox(height: 4),
                Text(task.title, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 6),
                Text(
                  task.description,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                ),
                const SizedBox(height: 12),
                TagChip(
                  label: statusLabel.toUpperCase(),
                  backgroundColor: task.status == TaskStatus.done
                      ? MedlearnColors.tertiarySoft
                      : task.status == TaskStatus.inProgress
                          ? MedlearnColors.primaryFixed
                          : MedlearnColors.surfaceTint,
                  foregroundColor: task.status == TaskStatus.done
                      ? MedlearnColors.tertiary
                      : MedlearnColors.primary,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _iconForTask(TaskCategory category) {
    switch (category) {
      case TaskCategory.course:
        return Icons.play_lesson_rounded;
      case TaskCategory.quiz:
        return Icons.quiz_rounded;
      case TaskCategory.revision:
        return Icons.menu_book_rounded;
      case TaskCategory.ai:
        return Icons.auto_awesome_rounded;
    }
  }
}
