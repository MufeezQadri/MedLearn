import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRoutes } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { apiRateLimit } from "./middleware/rate-limit.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimit);

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
