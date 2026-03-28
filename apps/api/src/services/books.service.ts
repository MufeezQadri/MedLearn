import { prisma } from "../lib/db.js";
import { cache } from "../lib/cache.js";
import { AppError } from "../lib/http-error.js";

export const booksService = {
  async getBooks(search?: string) {
    const cacheKey = `books:${search ?? "all"}`;
    const cached = await cache.get(cacheKey);

    if (cached) return cached;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const results = await prisma.book.findMany({ where });

    const formatted = results.map((b: any) => ({
      ...b,
      tags: b.tags ? b.tags.split(',') : []
    }));

    await cache.set(cacheKey, formatted, 180);
    return formatted;
  },

  async getBook(bookId: string) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return {
      ...book,
      tags: book.tags ? book.tags.split(',') : []
    };
  },

  async createBook(payload: {
    title: string;
    author: string;
    category: string;
    subject: string;
    edition: string;
    coverUrl: string;
    description: string;
    tags?: string[];
  }) {
    const book = await prisma.book.create({
      data: {
        title: payload.title,
        author: payload.author,
        category: payload.category,
        subject: payload.subject,
        edition: payload.edition,
        coverUrl: payload.coverUrl,
        description: payload.description,
        featured: false,
        tags: payload.tags ? payload.tags.join(',') : "",
      }
    });

    await cache.del("books:all");
    return {
      ...book,
      tags: book.tags ? book.tags.split(',') : []
    };
  },

  async searchBooks(query: string) {
    return await this.getBooks(query);
  },
};
