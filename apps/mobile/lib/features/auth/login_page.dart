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
                      height: 52,
                      width: 52,
                      decoration: BoxDecoration(
                        color: MedlearnColors.primary,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: MedlearnColors.outline),
                      ),
                      child: const Icon(Icons.local_hospital_rounded, color: Colors.white, size: 26),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'MedLearn',
                          style: GoogleFonts.sora(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
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
                const SizedBox(height: 32),
                Text(
                  'A sharper way to learn medicine.',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        color: MedlearnColors.primaryDark,
                        height: 1.1,
                      ),
                ),
                const SizedBox(height: 32),
                EditorialCard(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Sign in', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontSize: 24)),
                      const SizedBox(height: 6),
                      Text(
                        'Enter your medical credentials or use a demo.',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                      ),
                      const SizedBox(height: 24),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email address',
                          prefixIcon: Icon(Icons.alternate_email_rounded),
                        ),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock_outline_rounded),
                        ),
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 14),
                        Text(
                          _error!,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.error),
                        ),
                      ],
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: _submit,
                          style: FilledButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 18),
                          ),
                          child: const Text('Enter MedLearn'),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => ref.read(appControllerProvider.notifier).signIn(DemoCatalog.student),
                              child: const Text('Student'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => ref.read(appControllerProvider.notifier).signIn(DemoCatalog.admin),
                              child: const Text('Admin'),
                            ),
                          ),
                        ],
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
