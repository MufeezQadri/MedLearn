import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/widgets/med_widgets.dart';

class ProgressPage extends ConsumerWidget {
  const ProgressPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;
    final progress = DemoCatalog.progressFor(user, state.attempts);

    return Scaffold(
      appBar: AppBar(title: const Text('Progress')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            children: [
              Expanded(
                child: MetricTile(
                  label: 'Completion',
                  value: '${progress.completionPercent}%',
                  icon: Icons.auto_graph_rounded,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: MetricTile(
                  label: 'Accuracy',
                  value: '${progress.averageAccuracy}%',
                  icon: Icons.emoji_events_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
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
                  label: 'Quizzes',
                  value: '${progress.quizzesTaken}',
                  icon: Icons.quiz_rounded,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const SectionHeader(eyebrow: 'Weekly analytics', title: 'Trend signals'),
          const SizedBox(height: 14),
          ...progress.insights.map(
            (insight) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: EditorialCard(
                color: insight.label == 'Accuracy' ? const Color(0xFFEAF6FF) : MedlearnColors.surface,
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(insight.label, style: Theme.of(context).textTheme.bodyMedium),
                          const SizedBox(height: 6),
                          Text(insight.value, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 30)),
                        ],
                      ),
                    ),
                    Text(
                      insight.trend,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: const Color(0xFF006947), fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 18),
          const SectionHeader(eyebrow: 'Knowledge map', title: 'Weak vs strong'),
          const SizedBox(height: 12),
          EditorialCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Weak topics', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 10),
                ...progress.weakTopics.map(
                  (topic) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: TagChip(label: topic),
                  ),
                ),
                const SizedBox(height: 18),
                Text('Strong topics', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 10),
                ...progress.strongTopics.map(
                  (topic) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: TagChip(label: topic, selected: true),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          const SectionHeader(eyebrow: 'Momentum', title: 'Weekly snapshot'),
          const SizedBox(height: 12),
          const EditorialCard(
            child: MiniBarChart(values: [34, 46, 58, 40, 70, 82, 92]),
          ),
        ],
      ),
    );
  }
}
