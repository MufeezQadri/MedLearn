import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/app_state.dart';
import '../features/auth/login_page.dart';
import '../features/shell/medlearn_shell.dart';
import 'app_theme.dart';

class MedLearnApp extends ConsumerWidget {
  const MedLearnApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appControllerProvider);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'MedLearn AI',
      theme: MedLearnTheme.light(),
      home: state.currentUser == null ? const LoginPage() : const MedlearnShell(),
    );
  }
}
