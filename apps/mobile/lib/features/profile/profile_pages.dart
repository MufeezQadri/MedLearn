import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/widgets/med_widgets.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;
    final progress = DemoCatalog.progressFor(user, state.attempts);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          EditorialCard(
            color: MedlearnColors.primary,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: MedlearnColors.primaryFixed,
                  child: Icon(
                    user.role == DemoCatalog.admin.role ? Icons.shield_rounded : Icons.person_rounded,
                    color: MedlearnColors.primary,
                    size: 30,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  user.fullName,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white, fontSize: 34),
                ),
                const SizedBox(height: 6),
                Text(
                  user.email,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white70),
                ),
                const SizedBox(height: 10),
                TagChip(label: user.track, selected: true),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: MetricTile(
                  label: 'Hours learned',
                  value: progress.hoursLearned.toStringAsFixed(1),
                  icon: Icons.schedule_rounded,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: MetricTile(
                  label: 'Quiz accuracy',
                  value: '${progress.averageAccuracy}%',
                  icon: Icons.bar_chart_rounded,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          EditorialCard(
            child: SwitchListTile(
              value: state.notificationsEnabled,
              onChanged: (_) => ref.read(appControllerProvider.notifier).toggleNotifications(),
              title: const Text('Push notifications'),
              subtitle: const Text('Quiz reminders, planner alerts, and AI nudges.'),
            ),
          ),
          const SizedBox(height: 12),
          EditorialCard(
            child: SwitchListTile(
              value: state.plannerAiEnabled,
              onChanged: (_) => ref.read(appControllerProvider.notifier).togglePlannerAi(),
              title: const Text('AI planner suggestions'),
              subtitle: const Text('Allow the planner to auto-schedule weak-topic study blocks.'),
            ),
          ),
        ],
      ),
    );
  }
}
