import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../core/mock_data.dart';
import '../../core/models.dart';
import '../../core/widgets/med_widgets.dart';

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase();
    final books = DemoCatalog.books.where((book) {
      return query.isEmpty ||
          book.title.toLowerCase().contains(query) ||
          book.author.toLowerCase().contains(query) ||
          book.tags.any((tag) => tag.toLowerCase().contains(query));
    }).toList();

    final Map<String, Map<String, List<LibraryBook>>> groupedBooks = {};
    for (final book in books) {
      groupedBooks.putIfAbsent(book.category, () => <String, List<LibraryBook>>{});
      groupedBooks[book.category]!.putIfAbsent(book.subject, () => <LibraryBook>[]);
      groupedBooks[book.category]![book.subject]!.add(book);
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Library')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          EditorialCard(
            color: MedlearnColors.primary,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'DIGITAL LIBRARY',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: MedlearnColors.primaryFixed,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 2.0,
                      ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Master your medical curriculum.',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white, fontSize: 36),
                ),
                const SizedBox(height: 8),
                Text(
                  'Access authoritative textbooks, subject collections, and AI-enhanced summaries.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search textbooks or authors...',
              suffixIcon: IconButton(
                onPressed: () => setState(() {}),
                icon: const Icon(Icons.search_rounded),
              ),
            ),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 18),
          ...groupedBooks.entries.expand((categoryEntry) {
            final category = categoryEntry.key;
            final subjects = categoryEntry.value;

            return [
              Padding(
                padding: const EdgeInsets.only(top: 16, bottom: 8),
                child: Text(
                  category.toUpperCase(),
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: MedlearnColors.primary,
                      ),
                ),
              ),
              ...subjects.entries.expand((subjectEntry) {
                final subject = subjectEntry.key;
                final subjectBooks = subjectEntry.value;

                return [
                  Padding(
                    padding: const EdgeInsets.only(top: 8, bottom: 12),
                    child: Row(
                      children: [
                        Container(width: 4, height: 16, color: MedlearnColors.primaryDark),
                        const SizedBox(width: 8),
                        Text(
                          subject,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w700,
                              ),
                        ),
                      ],
                    ),
                  ),
                  ...subjectBooks.map(
                    (LibraryBook book) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: EditorialCard(
                        color: MedlearnColors.surfaceLow,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: book.tags.map((tag) => TagChip(label: tag)).toList(),
                            ),
                            const SizedBox(height: 12),
                            Text(book.title, style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 4),
                            Text(
                              '${book.author} · ${book.edition}',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: MedlearnColors.onSurfaceVariant),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              book.summary,
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: MedlearnColors.onSurfaceVariant, height: 1.5),
                            ),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: () {},
                              child: const Text('Read'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ];
              }),
            ];
          }),
        ],
      ),
    );
  }
}
