import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { apiRoutes } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { apiRateLimit } from "./middleware/rate-limit.middleware.js";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimit);
// Serve uploaded files (book covers, PDFs, etc.) from /uploads
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      service: "medlearn-api",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
