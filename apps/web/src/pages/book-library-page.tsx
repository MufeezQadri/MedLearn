import { useMemo, useState } from "react";
import { BookCard } from "../components/book-card";
import { Card } from "../components/ui/card";
import { mockApp } from "../data/mock-app";

export const BookLibraryPage = () => {
  const [search, setSearch] = useState("");
  const items = useMemo(() => mockApp.getBooks(search), [search]);

  const groupedBooks = useMemo(() => {
    const groups: Record<string, Record<string, typeof items>> = {};
    for (const book of items) {
      if (!groups[book.category]) {
        groups[book.category] = {};
      }
      if (!groups[book.category][book.subject]) {
        groups[book.category][book.subject] = [];
      }
      groups[book.category][book.subject].push(book);
    }
    return groups;
  }, [items]);

  return (
    <div className="space-y-8 pb-12">
      <Card className="bg-signature text-white">
        <h2 className="font-headline text-4xl font-extrabold tracking-tight">Master your medical curriculum</h2>
        <p className="mt-3 max-w-3xl text-primary-fixed">
          Access the world’s most authoritative clinical textbooks, organized by subject and layered with AI-first revision workflows.
        </p>
        <input
          className="mt-6 w-full rounded-3xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-primary-fixed outline-none"
          placeholder="Search textbooks, authors, or categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Card>

      {Object.entries(groupedBooks).map(([category, subjects]) => (
        <div key={category} className="space-y-6">
          <h3 className="text-3xl font-bold border-b border-border pb-3 uppercase tracking-tight">{category}</h3>
          <div className="space-y-8">
            {Object.entries(subjects).map(([subject, books]) => (
              <div key={subject} className="space-y-4">
                <h4 className="text-xl font-semibold text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  {subject}
                </h4>
                <div className="grid gap-6 xl:grid-cols-2">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
