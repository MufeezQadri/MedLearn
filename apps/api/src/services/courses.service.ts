import { v4 as uuidv4 } from "uuid";
import { cache } from "../lib/cache.js";
import { state } from "../data/store.js";
import { getCourseOrThrow } from "./helpers.js";

export const coursesService = {
  async getCourses(query?: { subject?: string; search?: string }) {
    const cacheKey = `courses:${query?.subject ?? "all"}:${query?.search ?? "all"}`;
    const cached = await cache.get<typeof state.courses>(cacheKey);

    if (cached) {
      return cached;
    }

    let results = [...state.courses];

    if (query?.subject) {
      results = results.filter((item) => item.subject.toLowerCase() === query.subject?.toLowerCase());
    }

    if (query?.search) {
      const needle = query.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          item.tags.some((tag) => tag.toLowerCase().includes(needle)),
      );
    }

    await cache.set(cacheKey, results, 120);
    return results;
  },

  getCourse(courseId: string) {
    const course = getCourseOrThrow(courseId);

    return {
      ...course,
      modules: state.modules
        .filter((item) => item.courseId === course.id)
        .sort((left, right) => left.orderIndex - right.orderIndex),
    };
  },

  async createCourse(payload: {
    title: string;
    description: string;
    subject: string;
    difficulty: "easy" | "medium" | "hard";
    durationHours: number;
    educator: string;
    thumbnailUrl: string;
  }) {
    const course = {
      id: uuidv4(),
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: payload.title,
      description: payload.description,
      subject: payload.subject,
      difficulty: payload.difficulty,
      durationHours: payload.durationHours,
      educator: payload.educator,
      thumbnailUrl: payload.thumbnailUrl,
      progressPercent: 0,
      enrolledStudents: 0,
      tags: [],
    };

    state.courses.push(course);
    await cache.del("courses:all:all");
    return course;
  },

  async updateCourse(courseId: string, payload: Partial<Omit<(typeof state.courses)[number], "id">>) {
    const course = getCourseOrThrow(courseId);
    Object.assign(course, payload);
    await cache.del("courses:all:all");
    return course;
  },

  async deleteCourse(courseId: string) {
    const course = getCourseOrThrow(courseId);
    state.courses = state.courses.filter((item) => item.id !== course.id);
    state.modules = state.modules.filter((item) => item.courseId !== course.id);
    await cache.del("courses:all:all");
    return { deleted: true };
  },

  enrollCourse(courseId: string, _userId: string) {
    const course = getCourseOrThrow(courseId);
    course.enrolledStudents += 1;

    return {
      enrolled: true,
      course,
    };
  },
};
