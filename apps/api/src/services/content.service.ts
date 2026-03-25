import { v4 as uuidv4 } from "uuid";
import { state } from "../data/store.js";
import { AppError } from "../lib/http-error.js";

export const contentService = {
  getModule(moduleId: string) {
    const module = state.modules.find((item) => item.id === moduleId);

    if (!module) {
      throw new AppError("Module not found", 404);
    }

    return {
      ...module,
      video: state.videos.find((item) => item.id === module.videoId),
      pdf: state.pdfs.find((item) => item.id === module.pdfId),
      notes: state.notes.filter((item) => item.moduleId === module.id),
    };
  },

  getVideo(videoId: string) {
    const video = state.videos.find((item) => item.id === videoId);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    return video;
  },

  getPdf(pdfId: string) {
    const pdf = state.pdfs.find((item) => item.id === pdfId);

    if (!pdf) {
      throw new AppError("PDF not found", 404);
    }

    return pdf;
  },

  createNote(userId: string, payload: { moduleId?: string; bookId?: string; content: string }) {
    const note = {
      id: uuidv4(),
      userId,
      moduleId: payload.moduleId,
      bookId: payload.bookId,
      content: payload.content,
      createdAt: new Date().toISOString(),
    };

    state.notes.push(note);
    return note;
  },
};
