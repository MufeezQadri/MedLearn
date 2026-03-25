import { v4 as uuidv4 } from "uuid";
import { cache } from "../lib/cache.js";
import { state } from "../data/store.js";
import { AppError } from "../lib/http-error.js";

const applySearch = (query: string) => {
  const needle = query.toLowerCase();

  return state.books.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.author.toLowerCase().includes(needle) ||
      item.tags.some((tag) => tag.toLowerCase().includes(needle)),
  );
};

export const booksService = {
  async getBooks(search?: string) {
    const cacheKey = `books:${search ?? "all"}`;
    const cached = await cache.get<typeof state.books>(cacheKey);

    if (cached) {
      return cached;
    }

    const results = search ? applySearch(search) : [...state.books];
    await cache.set(cacheKey, results, 180);
    return results;
  },

  getBook(bookId: string) {
    const book = state.books.find((item) => item.id === bookId);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  },

  createBook(payload: {
    title: string;
    author: string;
    category: string;
    edition: string;
    coverUrl: string;
    description: string;
    tags?: string[];
  }) {
    const book = {
      id: uuidv4(),
      featured: false,
      tags: payload.tags ?? [],
      ...payload,
    };

    state.books.push(book);
    return book;
  },

  searchBooks(query: string) {
    return applySearch(query);
  },
};
