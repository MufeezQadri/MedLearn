import { v4 as uuidv4 } from "uuid";
import { state } from "../data/store.js";

export const plannerService = {
  getPlanner(userId: string) {
    return state.studyTasks
      .filter((item) => item.userId === userId)
      .sort((left, right) => left.scheduledFor.localeCompare(right.scheduledFor));
  },

  createTask(
    userId: string,
    payload: { title: string; description: string; scheduledFor: string; category: "course" | "quiz" | "revision" | "ai" },
  ) {
    const task = {
      id: uuidv4(),
      userId,
      title: payload.title,
      description: payload.description,
      scheduledFor: payload.scheduledFor,
      category: payload.category,
      status: "todo" as const,
    };

    state.studyTasks.push(task);
    return task;
  },

  deleteTask(userId: string, taskId: string) {
    const before = state.studyTasks.length;
    state.studyTasks = state.studyTasks.filter((item) => !(item.id === taskId && item.userId === userId));
    return { deleted: state.studyTasks.length < before };
  },
};
