import { v4 as uuidv4 } from "uuid";
import { state } from "../data/store.js";

export const notificationsService = {
  getNotifications(userId: string) {
    return state.notifications
      .filter((item) => item.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  },

  createNotification(
    userId: string,
    payload: { title: string; message: string; type: "system" | "planner" | "recommendation" | "quiz" },
  ) {
    const notification = {
      id: uuidv4(),
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      createdAt: new Date().toISOString(),
      read: false,
    };

    state.notifications.push(notification);
    return notification;
  },
};
