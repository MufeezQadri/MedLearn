import { prisma } from "../lib/db.js";
import { cache } from "../lib/cache.js";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../lib/http-error.js";

export const coursesService = {
  async getCourses(query?: { subject?: string; search?: string }) {
    const cacheKey = `courses:${query?.subject ?? "all"}:${query?.search ?? "all"}`;
    const cached = await cache.get(cacheKey);

    if (cached) return cached;

    const where: any = {};
    
    if (query?.subject) {
      where.subject = { equals: query.subject };
    }

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { tags: { contains: query.search } },
      ];
    }

    const results = await prisma.course.findMany({
      where,
      include: {
        _count: { select: { modules: true } }
      }
    });

    // Formatting tags back to array for frontend
    const formatted = results.map((c: any) => ({
      ...c,
      tags: c.tags ? c.tags.split(',') : []
    }));

    await cache.set(cacheKey, formatted, 60);
    return formatted;
  },

  async getCourse(courseId: string) {
    const course = await prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: { modules: { orderBy: { orderIndex: 'asc' } } }
    });
    return {
      ...course,
      tags: course.tags ? course.tags.split(',') : []
    };
  },

  async createCourse(payload: {
    title: string;
    description: string;
    section: string;
    subject: string;
    difficulty: "easy" | "medium" | "hard";
    durationHours: number;
    educator: string;
    thumbnailUrl: string;
  }) {
    const course = await prisma.course.create({
      data: {
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: payload.title,
        description: payload.description,
        section: payload.section || "General",
        subject: payload.subject,
        difficulty: payload.difficulty,
        durationHours: payload.durationHours,
        educator: payload.educator,
        thumbnailUrl: payload.thumbnailUrl,
        tags: "",
      }
    });
    await cache.del("courses:all:all");
    return course;
  },

  async updateCourse(courseId: string, payload: any) {
    const course = await prisma.course.update({
      where: { id: courseId },
      data: payload
    });
    await cache.del("courses:all:all");
    return course;
  },

  async deleteCourse(courseId: string) {
    await prisma.course.delete({ where: { id: courseId } });
    await cache.del("courses:all:all");
    return { deleted: true };
  },

  async enrollCourse(courseId: string, userId: string) {
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: {},
      create: {
        userId,
        courseId
      }
    });
    
    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledStudents: { increment: 1 } }
    });

    return { enrolled: true };
  },
};
