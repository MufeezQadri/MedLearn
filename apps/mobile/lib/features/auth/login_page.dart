import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/widgets/med_widgets.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _emailController = TextEditingController(text: DemoCatalog.student.email);
  final _passwordController = TextEditingController(text: DemoCatalog.credentials[DemoCatalog.student.email]);
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    final user = DemoCatalog.authenticate(_emailController.text, _passwordController.text);

    if (user == null) {
      setState(() {
        _error = 'Invalid credentials. Use the demo student or admin account.';
      });
      return;
    }

    ref.read(appControllerProvider.notifier).signIn(user);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: MedScaffoldBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      height: 60,
                      width: 60,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [MedlearnColors.primaryFixed, Colors.white],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: MedlearnColors.outline),
                      ),
                      child: const Icon(Icons.local_hospital_rounded, color: MedlearnColors.primary, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'MedLearn AI',
                          style: GoogleFonts.sora(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: MedlearnColors.primaryDark,
                          ),
                        ),
                        Text(
                          'Clinical intelligence workspace',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: MedlearnColors.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                const TagChip(
                  label: 'Built for MBBS, NEET PG, and USMLE',
                  icon: Icons.auto_awesome_rounded,
                  backgroundColor: Color(0xFFF5EFE8),
                  foregroundColor: MedlearnColors.primaryDark,
                ),
                const SizedBox(height: 18),
                Text(
                  'A calmer, sharper way to learn medicine on mobile.',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 40, color: MedlearnColors.primaryDark),
                ),
                const SizedBox(height: 14),
                Text(
                  'Move between courses, AI guidance, timed quizzes, and your daily plan without losing context. This Flutter app keeps the same MedLearn system, with a stronger mobile-native feel.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: MedlearnColors.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 22),
                EditorialCard(
                  padding: const EdgeInsets.all(22),
                  gradient: const LinearGradient(
                    colors: [
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
                      Row(
                        children: [
                          const Expanded(
                            child: _HeroMetric(
                              label: 'MCQ Engine',
                              value: 'Timed',
                              accent: Color.fromRGBO(255, 255, 255, 0.18),
                            ),
                          ),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: _HeroMetric(
                              label: 'AI Layer',
                              value: 'Adaptive',
                              accent: Color.fromRGBO(255, 255, 255, 0.2),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      Text(
                        'One app for concept building, practice, and feedback loops.',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Today\'s planner, weak-topic insights, course continuation, and AI doubt-solving are all surfaced from the same learning graph.',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Colors.white.withValues(alpha: 0.8),
                            ),
                      ),
                      const SizedBox(height: 18),
                      const Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _BenefitChip(label: 'Quiz-first remediation', icon: Icons.quiz_rounded),
                          _BenefitChip(label: 'Clinical books library', icon: Icons.menu_book_rounded),
                          _BenefitChip(label: 'AI study planner', icon: Icons.event_note_rounded),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                EditorialCard(
                  padding: const EdgeInsets.all(22),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Sign in', style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 6),
                      Text(
                        'Use the demo accounts below to explore the full mobile experience.',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                      ),
                      const SizedBox(height: 18),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(Icons.alternate_email_rounded),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock_outline_rounded),
                        ),
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 12),
                        Text(
                          _error!,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.error),
                        ),
                      ],
                      const SizedBox(height: 18),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: _submit,
                          icon: const Icon(Icons.arrow_forward_rounded),
                          label: const Text('Enter MedLearn'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => ref.read(appControllerProvider.notifier).signIn(DemoCatalog.student),
                              child: const Text('Student demo'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => ref.read(appControllerProvider.notifier).signIn(DemoCatalog.admin),
                              child: const Text('Admin demo'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Demo credentials',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Student: sarah@medlearn.ai / Password@123\nAdmin: admin@medlearn.ai / Admin@123',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: MedlearnColors.onSurfaceVariant,
                                    height: 1.5,
                                  ),
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
        ),
      ),
    );
  }
}

class _HeroMetric extends StatelessWidget {
  const _HeroMetric({
    required this.label,
    required this.value,
    required this.accent,
  });

  final String label;
  final String value;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: accent,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.white.withValues(alpha: 0.76),
                  letterSpacing: 1.8,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white),
          ),
        ],
      ),
    );
  }
}

class _BenefitChip extends StatelessWidget {
  const _BenefitChip({
    required this.label,
    required this.icon,
  });

  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.white),
          const SizedBox(width: 8),
          Text(
            label,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(color: Colors.white),
          ),
        ],
      ),
    );
  }
}
