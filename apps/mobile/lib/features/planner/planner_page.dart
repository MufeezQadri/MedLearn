import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class PlannerPage extends ConsumerStatefulWidget {
  const PlannerPage({super.key});

  @override
  ConsumerState<PlannerPage> createState() => _PlannerPageState();
}

class _PlannerPageState extends ConsumerState<PlannerPage> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  DateTime _scheduledFor = DateTime.now().add(const Duration(hours: 3));
  TaskCategory _category = TaskCategory.revision;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser ?? DemoCatalog.student;
    final tasks = state.tasks.where((task) => task.userId == user.id).toList()
      ..sort((a, b) => a.scheduledFor.compareTo(b.scheduledFor));

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
      children: [
        const SectionHeader(eyebrow: 'Study planner', title: 'Daily schedule'),
        const SizedBox(height: 16),
        EditorialCard(
          color: MedlearnColors.primary,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AI SCHEDULING'.toUpperCase(),
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: MedlearnColors.primaryFixed,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.0,
                    ),
              ),
              const SizedBox(height: 10),
              Text(
                'Build a revision rhythm that adapts to your weak topics and exam calendar.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white, fontSize: 34),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        EditorialCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Add task', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 14),
              TextField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Task title'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 12),
              InkWell(
                onTap: () async {
                  final pickedDate = await showDatePicker(
                    context: context,
                    firstDate: DateTime.now().subtract(const Duration(days: 1)),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                    initialDate: _scheduledFor,
                  );
                  if (!context.mounted || pickedDate == null) return;
                  final pickedTime = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.fromDateTime(_scheduledFor),
                  );
                  if (pickedTime == null) return;
                  setState(() {
                    _scheduledFor = DateTime(
                      pickedDate.year,
                      pickedDate.month,
                      pickedDate.day,
                      pickedTime.hour,
                      pickedTime.minute,
                    );
                  });
                },
                child: InputDecorator(
                  decoration: const InputDecoration(labelText: 'Scheduled for'),
                  child: Text(DateFormat('EEE, d MMM · hh:mm a').format(_scheduledFor)),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<TaskCategory>(
                initialValue: _category,
                decoration: const InputDecoration(labelText: 'Category'),
                items: TaskCategory.values
                    .map(
                      (item) => DropdownMenuItem<TaskCategory>(
                        value: item,
                        child: Text(item.name),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  if (value != null) setState(() => _category = value);
                },
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () {
                    if (_titleController.text.trim().isEmpty || _descriptionController.text.trim().isEmpty) {
                      return;
                    }
                    ref.read(appControllerProvider.notifier).addTask(
                          title: _titleController.text.trim(),
                          description: _descriptionController.text.trim(),
                          scheduledFor: _scheduledFor,
                          category: _category,
                        );
                    _titleController.clear();
                    _descriptionController.clear();
                  },
                  child: const Text('Create task'),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeader(eyebrow: 'Agenda', title: 'Upcoming tasks'),
        const SizedBox(height: 12),
        if (tasks.isEmpty)
          const EmptyStateCard(
            title: 'No tasks planned',
            message: 'Use the form above to create your first study block.',
            icon: Icons.event_note_rounded,
          )
        else
          ...tasks.map(
            (task) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: EditorialCard(
                color: MedlearnColors.surfaceLow,
                child: Row(
                  children: [
                    Container(
                      height: 44,
                      width: 44,
                      decoration: BoxDecoration(
                        color: MedlearnColors.surface,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.calendar_today_rounded, color: MedlearnColors.primary),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            DateFormat('EEE, d MMM · hh:mm a').format(task.scheduledFor),
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: MedlearnColors.primary,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.8,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(task.title, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 4),
                          Text(
                            task.description,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () => ref.read(appControllerProvider.notifier).deleteTask(task.id),
                      icon: const Icon(Icons.delete_outline_rounded),
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
