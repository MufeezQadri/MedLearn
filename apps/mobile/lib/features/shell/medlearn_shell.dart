import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';
import '../../core/app_state.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';
import '../admin/admin_page.dart';
import '../courses/courses_flow.dart';
import '../dashboard/dashboard_page.dart';
import '../library/library_page.dart';
import '../planner/planner_page.dart';
import '../profile/profile_pages.dart';
import '../progress/progress_page.dart';
import '../quiz/quiz_flow.dart';

class MedlearnShell extends ConsumerStatefulWidget {
  const MedlearnShell({super.key});

  @override
  ConsumerState<MedlearnShell> createState() => _MedlearnShellState();
}

class _MedlearnShellState extends ConsumerState<MedlearnShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appControllerProvider);
    final user = state.currentUser!;

    final pages = <Widget>[
      DashboardPage(onOpenCourses: () => setState(() => _index = 1), onOpenPlanner: () => setState(() => _index = 3)),
      const CoursesPage(),
      const QuizHubPage(),
      const PlannerPage(),
    ];

    const navItems = [
      _ShellDestination(
        label: 'Home',
        icon: Icons.dashboard_outlined,
        selectedIcon: Icons.dashboard_rounded,
      ),
      _ShellDestination(
        label: 'Courses',
        icon: Icons.play_lesson_outlined,
        selectedIcon: Icons.play_lesson_rounded,
      ),
      _ShellDestination(
        label: 'Quiz',
        icon: Icons.bolt_outlined,
        selectedIcon: Icons.bolt_rounded,
      ),
      _ShellDestination(
        label: 'Planner',
        icon: Icons.event_note_outlined,
        selectedIcon: Icons.event_note_rounded,
      ),
    ];

    final titles = ['Learning cockpit', 'Courses', 'Quiz engine', 'Study planner'];

    return Scaffold(
      extendBody: true,
      drawer: _AppDrawer(
        user: user,
        onNavigate: (page) {
          Navigator.pop(context);
          Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
        },
      ),
      body: MedScaffoldBackground(
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
                child: _ShellTopBar(
                  title: titles[_index],
                  user: user,
                  onOpenNotifications: () => _showNotifications(context),
                ),
              ),
              Expanded(
                child: IndexedStack(
                  index: _index,
                  children: pages,
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: _ShellNavBar(
          index: _index,
          items: navItems,
          onTap: (value) => setState(() => _index = value),
        ),
      ),
    );
  }

  void _showNotifications(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) {
        return MedScaffoldBackground(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
            children: [
              Text(
                'Notifications',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Study reminders, AI guidance, and exam updates.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
              ),
              const SizedBox(height: 18),
              ...DemoCatalog.notifications.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: EditorialCard(
                    padding: const EdgeInsets.all(18),
                    color: MedlearnColors.surface,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          height: 44,
                          width: 44,
                          decoration: BoxDecoration(
                            color: MedlearnColors.surfaceTint,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.notifications_active_outlined, color: MedlearnColors.primary),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title, style: Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 6),
                              Text(
                                item.message,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                      color: MedlearnColors.onSurfaceVariant,
                                    ),
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
          ),
        );
      },
    );
  }
}

class _ShellTopBar extends StatelessWidget {
  const _ShellTopBar({
    required this.title,
    required this.user,
    required this.onOpenNotifications,
  });

  final String title;
  final UserProfile user;
  final VoidCallback onOpenNotifications;

  @override
  Widget build(BuildContext context) {
    final initials = user.fullName
        .split(' ')
        .where((part) => part.isNotEmpty)
        .take(2)
        .map((part) => part.characters.first)
        .join();

    return Row(
      children: [
        Builder(
          builder: (context) => IconButton(
            onPressed: () => Scaffold.of(context).openDrawer(),
            icon: const Icon(Icons.grid_view_rounded),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                DateFormat('EEE, d MMM').format(DateTime.now()).toUpperCase(),
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: MedlearnColors.primary,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.1,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        IconButton(
          onPressed: onOpenNotifications,
          icon: const Icon(Icons.notifications_none_rounded),
        ),
        const SizedBox(width: 8),
        Container(
          height: 48,
          width: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: MedlearnColors.primary,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            initials,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(color: Colors.white),
          ),
        ),
      ],
    );
  }
}

class _ShellNavBar extends StatelessWidget {
  const _ShellNavBar({
    required this.index,
    required this.items,
    required this.onTap,
  });

  final int index;
  final List<_ShellDestination> items;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.98),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: MedlearnColors.outline.withValues(alpha: 0.4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: List.generate(items.length, (itemIndex) {
          final item = items[itemIndex];
          final selected = itemIndex == index;

          return Expanded(
            child: InkWell(
              borderRadius: BorderRadius.circular(24),
              onTap: () => onTap(itemIndex),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 240),
                curve: Curves.easeOut,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: selected ? MedlearnColors.primaryFixed : Colors.transparent,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      selected ? item.selectedIcon : item.icon,
                      color: selected ? MedlearnColors.primary : MedlearnColors.onSurfaceVariant,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.label,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: selected ? MedlearnColors.primary : MedlearnColors.onSurfaceVariant,
                            fontWeight: selected ? FontWeight.w800 : FontWeight.w700,
                          ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _AppDrawer extends ConsumerWidget {
  const _AppDrawer({
    required this.user,
    required this.onNavigate,
  });

  final UserProfile user;
  final void Function(Widget page) onNavigate;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Drawer(
      child: MedScaffoldBackground(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(20, 64, 20, 22),
              decoration: const BoxDecoration(
                color: MedlearnColors.primaryDark,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 60,
                    width: 60,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: Icon(
                      user.role == UserRole.admin ? Icons.shield_rounded : Icons.person_rounded,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user.fullName,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.email,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                  ),
                  const SizedBox(height: 14),
                  TagChip(
                    label: user.track.toUpperCase(),
                    icon: Icons.auto_graph_rounded,
                    backgroundColor: Colors.white.withValues(alpha: 0.16),
                    foregroundColor: Colors.white,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 22),
              child: Column(
                children: [
                  _DrawerTile(
                    icon: Icons.menu_book_rounded,
                    title: 'Book library',
                    subtitle: 'Core references and revision texts',
                    onTap: () => onNavigate(const LibraryPage()),
                  ),
                  _DrawerTile(
                    icon: Icons.bar_chart_rounded,
                    title: 'Progress tracker',
                    subtitle: 'Weak topics, trends, and streaks',
                    onTap: () => onNavigate(const ProgressPage()),
                  ),
                  _DrawerTile(
                    icon: Icons.person_rounded,
                    title: 'Profile',
                    subtitle: 'Learning profile and preferences',
                    onTap: () => onNavigate(const ProfilePage()),
                  ),
                  _DrawerTile(
                    icon: Icons.settings_outlined,
                    title: 'Settings',
                    subtitle: 'Notifications, account, and app controls',
                    onTap: () => onNavigate(const SettingsPage()),
                  ),
                  _DrawerTile(
                    icon: Icons.admin_panel_settings_rounded,
                    title: 'Admin panel',
                    subtitle: 'Content, analytics, and governance',
                    onTap: () => onNavigate(const AdminPage()),
                  ),
                  const SizedBox(height: 12),
                  ListTile(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    tileColor: MedlearnColors.errorSoft,
                    leading: const Icon(Icons.logout_rounded, color: MedlearnColors.error),
                    title: const Text('Logout'),
                    subtitle: const Text('Return to the sign-in screen'),
                    onTap: () {
                      Navigator.pop(context);
                      ref.read(appControllerProvider.notifier).signOut();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DrawerTile extends StatelessWidget {
  const _DrawerTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        tileColor: Colors.white.withValues(alpha: 0.86),
        leading: Container(
          height: 46,
          width: 46,
          decoration: BoxDecoration(
            color: MedlearnColors.surfaceTint,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: MedlearnColors.primary),
        ),
        title: Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right_rounded),
      ),
    );
  }
}

class _ShellDestination {
  const _ShellDestination({
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });

  final String label;
  final IconData icon;
  final IconData selectedIcon;
}
