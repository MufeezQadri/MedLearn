import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class AdminPage extends ConsumerWidget {
  const AdminPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;

    return Scaffold(
      appBar: AppBar(title: const Text('Admin Panel')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (user.role != UserRole.admin)
            const EmptyStateCard(
              title: 'Admin access required',
              message: 'Login with the admin demo to manage catalog content and platform metrics.',
              icon: Icons.lock_outline_rounded,
            )
          else ...[
            Row(
              children: [
                Expanded(
                  child: MetricTile(
                    label: 'Courses',
                    value: '${DemoCatalog.courses.length}',
                    icon: Icons.school_rounded,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: MetricTile(
                    label: 'Quizzes',
                    value: '${DemoCatalog.quizzes.length}',
                    icon: Icons.quiz_rounded,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: MetricTile(
                    label: 'Books',
                    value: '${DemoCatalog.books.length}',
                    icon: Icons.menu_book_rounded,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: EditorialCard(
                    color: MedlearnColors.primary,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.insights_rounded, color: Colors.white),
                        const SizedBox(height: 14),
                        Text(
                          '100K+ users ready',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white, fontSize: 28),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Redis + Postgres + quiz-first architecture',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
