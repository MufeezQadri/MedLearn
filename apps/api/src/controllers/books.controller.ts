import type { Request, Response } from "express";
import { booksService } from "../services/books.service.js";

export const booksController = {
  async list(req: Request, res: Response) {
    const data = await booksService.getBooks(req.query.search as string | undefined);
    res.json({ success: true, data });
  },

  async get(req: Request, res: Response) {
    const data = await booksService.getBook(req.params.id as string);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    res.status(201).json({ success: true, data: await booksService.createBook(req.body) });
  },

  async search(req: Request, res: Response) {
    res.json({ success: true, data: await booksService.searchBooks((req.query.q as string) ?? "") });
  },
};
