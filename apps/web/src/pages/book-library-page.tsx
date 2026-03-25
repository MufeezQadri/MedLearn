import { useMemo, useState } from "react";
import { BookCard } from "../components/book-card";
import { Card } from "../components/ui/card";
import { mockApp } from "../data/mock-app";

export const BookLibraryPage = () => {
  const [search, setSearch] = useState("");
  const items = useMemo(() => mockApp.getBooks(search), [search]);

  return (
    <div className="space-y-8">
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
      <div className="grid gap-6 xl:grid-cols-2">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
