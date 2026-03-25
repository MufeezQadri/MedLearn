import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/widgets/med_widgets.dart';

class AssistantPage extends ConsumerStatefulWidget {
  const AssistantPage({super.key});

  @override
  ConsumerState<AssistantPage> createState() => _AssistantPageState();
}

class _AssistantPageState extends ConsumerState<AssistantPage> {
  final _controller = TextEditingController();

  static const _starterPrompts = [
    'Explain ARDS in a high-yield way',
    'Build a 3-day revision sprint',
    'Break down this MCQ stem',
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _sendPrompt(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;
    ref.read(appControllerProvider.notifier).appendAssistantExchange(trimmed);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appControllerProvider);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
      children: [
        EditorialCard(
          padding: const EdgeInsets.all(22),
          gradient: const LinearGradient(
            colors: [
              Color(0xFF102832),
              MedlearnColors.primaryDark,
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
                label: 'AI assistant',
                icon: Icons.auto_awesome_rounded,
                backgroundColor: Color.fromRGBO(255, 255, 255, 0.14),
                foregroundColor: Colors.white,
              ),
              const SizedBox(height: 14),
              Text(
                'Doubt solving, remediation, and study design in one conversation.',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontSize: 30,
                    ),
              ),
              const SizedBox(height: 10),
              Text(
                'Ask for concept explanations, revision sprints, or mistake analysis based on your weak topics and quiz history.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withValues(alpha: 0.76),
                    ),
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: _starterPrompts
                    .map(
                      (prompt) => InkWell(
                        borderRadius: BorderRadius.circular(999),
                        onTap: () => _sendPrompt(prompt),
                        child: TagChip(
                          label: prompt,
                          backgroundColor: Colors.white.withValues(alpha: 0.14),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        GlassCard(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 52,
                width: 52,
                decoration: BoxDecoration(
                  color: MedlearnColors.primaryFixed,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Icon(Icons.health_and_safety_rounded, color: MedlearnColors.primary),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('What the assistant is good at', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
                    const SizedBox(height: 6),
                    Text(
                      'High-yield summaries, weak-topic coaching, exam-style reasoning, and AI-generated daily plans.',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        EditorialCard(
          padding: const EdgeInsets.all(18),
          color: Colors.white.withValues(alpha: 0.9),
          child: Column(
            children: [
              ...state.messages.map(
                (message) => Align(
                  alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    constraints: const BoxConstraints(maxWidth: 420),
                    decoration: BoxDecoration(
                      gradient: message.isUser
                          ? const LinearGradient(
                              colors: [MedlearnColors.primary, MedlearnColors.primaryContainer],
                            )
                          : null,
                      color: message.isUser ? null : MedlearnColors.surfaceLow,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(24),
                        topRight: const Radius.circular(24),
                        bottomLeft: Radius.circular(message.isUser ? 24 : 6),
                        bottomRight: Radius.circular(message.isUser ? 6 : 24),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          message.isUser ? 'You' : 'MedLearn AI',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: message.isUser ? Colors.white70 : MedlearnColors.primary,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.4,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          message.text,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: message.isUser ? Colors.white : MedlearnColors.onSurface,
                              ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          DateFormat('hh:mm a').format(message.timestamp),
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: message.isUser ? Colors.white70 : MedlearnColors.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      minLines: 1,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        hintText: 'Ask MedLearn AI about a concept, doubt, or study plan...',
                        prefixIcon: Icon(Icons.chat_bubble_outline_rounded),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  FilledButton(
                    onPressed: () => _sendPrompt(_controller.text),
                    style: FilledButton.styleFrom(
                      minimumSize: const Size(56, 56),
                      padding: EdgeInsets.zero,
                    ),
                    child: const Icon(Icons.send_rounded),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeader(eyebrow: 'AI recommendations', title: 'Focus stack'),
        const SizedBox(height: 12),
        ...DemoCatalog.recommendations.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: EditorialCard(
              padding: const EdgeInsets.all(18),
              gradient: item.priorityLabel.startsWith('High')
                  ? const LinearGradient(
                      colors: [MedlearnColors.primaryDark, MedlearnColors.primary],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    )
                  : null,
              color: item.priorityLabel.startsWith('High') ? MedlearnColors.primary : Colors.white,
              borderColor: item.priorityLabel.startsWith('High') ? Colors.transparent : MedlearnColors.outline,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.priorityLabel.toUpperCase(),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: item.priorityLabel.startsWith('High') ? Colors.white70 : MedlearnColors.primary,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2.0,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    item.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: item.priorityLabel.startsWith('High') ? Colors.white : null,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.description,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: item.priorityLabel.startsWith('High') ? Colors.white70 : MedlearnColors.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 12),
                  TagChip(
                    label: item.topic,
                    icon: Icons.bolt_rounded,
                    backgroundColor: item.priorityLabel.startsWith('High')
                        ? Colors.white.withValues(alpha: 0.14)
                        : MedlearnColors.surfaceTint,
                    foregroundColor: item.priorityLabel.startsWith('High')
                        ? Colors.white
                        : MedlearnColors.primary,
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
