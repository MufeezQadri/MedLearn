import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class CoursesPage extends StatefulWidget {
  const CoursesPage({super.key});

  @override
  State<CoursesPage> createState() => _CoursesPageState();
}

class _CoursesPageState extends State<CoursesPage> {
  final _searchController = TextEditingController();
  String _selectedFilter = 'All';

  static const _filters = ['All', 'Anatomy', 'Medicine', 'Pathology', 'Surgery'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase();
    final courses = DemoCatalog.courses.where((course) {
      final matchesQuery = query.isEmpty ||
          course.title.toLowerCase().contains(query) ||
          course.subject.toLowerCase().contains(query) ||
          course.tags.any((tag) => tag.toLowerCase().contains(query));
      final matchesFilter = _selectedFilter == 'All' || course.subject == _selectedFilter;
      return matchesQuery && matchesFilter;
    }).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 120),
      children: [
        EditorialCard(
          padding: const EdgeInsets.all(22),
          gradient: const LinearGradient(
            colors: [
              Color(0xFF122A35),
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
                label: 'Course catalog',
                icon: Icons.auto_stories_rounded,
                backgroundColor: Color.fromRGBO(255, 255, 255, 0.14),
                foregroundColor: Colors.white,
              ),
              const SizedBox(height: 16),
              Text(
                'Advance your clinical knowledge with structured, exam-aware pathways.',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontSize: 30,
                    ),
              ),
              const SizedBox(height: 10),
              Text(
                'Browse by subject, jump back into unfinished modules, and move from video to PDF without losing your progress signal.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withValues(alpha: 0.76),
                    ),
              ),
              const SizedBox(height: 18),
              TextField(
                controller: _searchController,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: 'Search courses, modules, or subjects',
                  prefixIcon: const Icon(Icons.search_rounded),
                  filled: true,
                  fillColor: Colors.white.withValues(alpha: 0.92),
                  suffixIcon: _searchController.text.isEmpty
                      ? null
                      : IconButton(
                          onPressed: () {
                            _searchController.clear();
                            setState(() {});
                          },
                          icon: const Icon(Icons.close_rounded),
                        ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: _filters.map((filter) {
              final selected = filter == _selectedFilter;
              return Padding(
                padding: const EdgeInsets.only(right: 10),
                child: InkWell(
                  borderRadius: BorderRadius.circular(999),
                  onTap: () => setState(() => _selectedFilter = filter),
                  child: TagChip(
                    label: filter,
                    selected: selected,
                    icon: selected ? Icons.check_rounded : null,
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 18),
        if (courses.isNotEmpty) ...[
          _FeaturedCourseCard(course: courses.first),
          const SizedBox(height: 16),
        ],
        ...courses.map(
          (course) => Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: _CourseCard(
              course: course,
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => CourseDetailPage(course: course)),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class CourseDetailPage extends StatelessWidget {
  const CourseDetailPage({
    super.key,
    required this.course,
  });

  final Course course;

  @override
  Widget build(BuildContext context) {
    final modules = DemoCatalog.modulesForCourse(course.id);

    return Scaffold(
      appBar: AppBar(title: Text(course.title)),
      body: MedScaffoldBackground(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          children: [
            EditorialCard(
              padding: const EdgeInsets.all(22),
              gradient: LinearGradient(
                colors: _gradientForCourse(course),
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderColor: Colors.transparent,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        height: 58,
                        width: 58,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.14),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Icon(course.heroIcon, color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            TagChip(
                              label: course.subject,
                              backgroundColor: Colors.white.withValues(alpha: 0.14),
                              foregroundColor: Colors.white,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              course.educator,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text(
                    course.title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    course.description,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white.withValues(alpha: 0.82)),
                  ),
                  const SizedBox(height: 18),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _CourseStatPill(label: '${course.durationHours}h', caption: 'Content'),
                      _CourseStatPill(label: '${modules.length}', caption: 'Modules'),
                      _CourseStatPill(label: '${course.progressPercent}%', caption: 'Complete'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            EditorialCard(
              padding: const EdgeInsets.all(18),
              color: Colors.white.withValues(alpha: 0.88),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Tags', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: course.tags
                        .map(
                          (tag) => TagChip(
                            label: tag,
                            backgroundColor: MedlearnColors.surfaceTint,
                            foregroundColor: MedlearnColors.primary,
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            const SectionHeader(eyebrow: 'Modules', title: 'Learning path'),
            const SizedBox(height: 14),
            ...modules.asMap().entries.map(
              (entry) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _ModuleCard(
                  module: entry.value,
                  index: entry.key + 1,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ContentViewerPage(course: course, module: entry.value),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ContentViewerPage extends StatelessWidget {
  const ContentViewerPage({
    super.key,
    required this.course,
    required this.module,
  });

  final Course course;
  final CourseModule module;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(module.title)),
      body: MedScaffoldBackground(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          children: [
            EditorialCard(
              padding: const EdgeInsets.all(22),
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF0D1721),
                  Color(0xFF142B3B),
                  MedlearnColors.primaryDark,
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
                      TagChip(
                        label: module.kind == ContentKind.video ? 'Video lesson' : 'PDF reader',
                        icon: module.kind == ContentKind.video
                            ? Icons.play_circle_fill_rounded
                            : Icons.picture_as_pdf_rounded,
                        backgroundColor: Colors.white.withValues(alpha: 0.14),
                        foregroundColor: Colors.white,
                      ),
                      const Spacer(),
                      Text(
                        '${module.durationMinutes} min',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    height: 250,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.14)),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            height: 74,
                            width: 74,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: Icon(
                              module.kind == ContentKind.video
                                  ? Icons.play_arrow_rounded
                                  : Icons.menu_book_rounded,
                              color: Colors.white,
                              size: 38,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            module.kind == ContentKind.video ? 'Native video surface' : 'Native PDF surface',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${course.title} · ${module.summary}',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.white.withValues(alpha: 0.72),
                                ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            EditorialCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(module.title, style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 10),
                  Text(
                    module.summary,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: MedlearnColors.onSurfaceVariant),
                  ),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(
                    value: module.completionPercent / 100,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(999),
                    backgroundColor: MedlearnColors.surfaceHigh,
                    color: MedlearnColors.primary,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${module.completionPercent}% complete',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: MedlearnColors.primary),
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

class _FeaturedCourseCard extends StatelessWidget {
  const _FeaturedCourseCard({
    required this.course,
  });

  final Course course;

  @override
  Widget build(BuildContext context) {
    return EditorialCard(
      padding: const EdgeInsets.all(20),
      gradient: LinearGradient(
        colors: _gradientForCourse(course),
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      borderColor: Colors.transparent,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const TagChip(
                  label: 'Featured path',
                  backgroundColor: Color.fromRGBO(255, 255, 255, 0.14),
                  foregroundColor: Colors.white,
                ),
                const SizedBox(height: 12),
                Text(
                  course.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  '${course.subject} · ${course.durationHours} hours · ${course.progressPercent}% complete',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14),
          Container(
            height: 64,
            width: 64,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.16),
              borderRadius: BorderRadius.circular(22),
            ),
            child: Icon(course.heroIcon, color: Colors.white, size: 30),
          ),
        ],
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  const _CourseCard({
    required this.course,
    required this.onTap,
  });

  final Course course;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(30),
      onTap: onTap,
      child: EditorialCard(
        padding: const EdgeInsets.all(18),
        color: Colors.white.withValues(alpha: 0.88),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 54,
                  width: 54,
                  decoration: BoxDecoration(
                    color: MedlearnColors.surfaceTint,
                    borderRadius: BorderRadius.circular(20),
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
            const SizedBox(height: 14),
            Text(
              course.description,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
            ),
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: course.tags
                  .map(
                    (tag) => TagChip(
                      label: tag,
                      backgroundColor: Colors.white,
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 14),
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
    );
  }
}

class _ModuleCard extends StatelessWidget {
  const _ModuleCard({
    required this.module,
    required this.index,
    required this.onTap,
  });

  final CourseModule module;
  final int index;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(30),
      onTap: onTap,
      child: EditorialCard(
        padding: const EdgeInsets.all(18),
        color: Colors.white.withValues(alpha: 0.9),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 48,
              width: 48,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: MedlearnColors.surfaceTint,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Text(
                '$index',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(color: MedlearnColors.primary),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(module.title, style: Theme.of(context).textTheme.titleMedium),
                      ),
                      const SizedBox(width: 10),
                      TagChip(
                        label: module.kind == ContentKind.video ? 'Video' : 'PDF',
                        icon: module.kind == ContentKind.video
                            ? Icons.play_circle_fill_rounded
                            : Icons.picture_as_pdf_rounded,
                        backgroundColor: MedlearnColors.surfaceTint,
                        foregroundColor: MedlearnColors.primary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    module.summary,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                  ),
                  const SizedBox(height: 14),
                  LinearProgressIndicator(
                    value: module.completionPercent / 100,
                    minHeight: 8,
                    borderRadius: BorderRadius.circular(999),
                    backgroundColor: MedlearnColors.surfaceHigh,
                    color: MedlearnColors.primary,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${module.completionPercent}% complete · ${module.durationMinutes} min',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: MedlearnColors.primary),
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

class _CourseStatPill extends StatelessWidget {
  const _CourseStatPill({
    required this.label,
    required this.caption,
  });

  final String label;
  final String caption;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 4),
          Text(
            caption,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}

List<Color> _gradientForCourse(Course course) {
  switch (course.subject) {
    case 'Anatomy':
      return const [Color(0xFF462E6A), Color(0xFF6A4BA3), Color(0xFF9470D8)];
    case 'Pathology':
      return const [Color(0xFF6A281E), Color(0xFFAD553D), Color(0xFFF18B4A)];
    default:
      return const [Color(0xFF0B3440), MedlearnColors.primaryDark, MedlearnColors.primary];
  }
}
