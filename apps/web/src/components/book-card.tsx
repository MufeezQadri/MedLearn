import { BookOpenText, Bookmark } from "lucide-react";
import type { Book } from "@medlearn/shared";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const BookCard = ({ book }: { book: Book }) => (
  <article className="rounded-3xl bg-surface-container-low p-4 transition hover:bg-surface-container-high">
    <div className="flex gap-4">
      <img src={book.coverUrl} alt={book.title} className="h-40 w-28 rounded-2xl object-cover shadow-md" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {book.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold">{book.title}</h3>
            <p className="text-sm text-on-surface-variant">{book.author}</p>
          </div>
          <p className="text-sm text-on-surface-variant">{book.description}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <Button className="flex-1">
            <span className="flex items-center gap-2">
              <BookOpenText className="h-4 w-4" />
              Read
            </span>
          </Button>
          <Button variant="secondary">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </article>
);
