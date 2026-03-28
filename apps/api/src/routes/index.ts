import { Router } from "express";
import { aiRoutes } from "./ai.routes.js";
import { authRoutes } from "./auth.routes.js";
import { booksRoutes } from "./books.routes.js";
import { contentRoutes } from "./content.routes.js";
import { coursesRoutes } from "./courses.routes.js";
import { notificationsRoutes } from "./notifications.routes.js";
import { plannerRoutes } from "./planner.routes.js";
import { progressRoutes } from "./progress.routes.js";
import { questionRoutes, quizRoutes } from "./quiz.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { usersRoutes } from "./users.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", usersRoutes);
apiRoutes.use("/courses", coursesRoutes);
apiRoutes.use("/", contentRoutes);
apiRoutes.use("/books", booksRoutes);
apiRoutes.use("/quizzes", quizRoutes);
apiRoutes.use("/questions", questionRoutes);
apiRoutes.use("/progress", progressRoutes);
apiRoutes.use("/ai", aiRoutes);
apiRoutes.use("/planner", plannerRoutes);
apiRoutes.use("/notifications", notificationsRoutes);
apiRoutes.use("/upload", uploadRoutes);
