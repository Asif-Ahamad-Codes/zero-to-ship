import cors from "cors";
import express from "express";
import Analysis from "./models/Analysis.js";
import { isDatabaseConnected } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAnalysisService } from "./service/analysisService.js";
import { createAnalysisRouter } from "./routes/analysisRoutes.js";

export function createApp({
  AnalysisModel = Analysis,
  databaseConnected = isDatabaseConnected,
  analysisOptions,
} = {}) {
  const app = express();
  const analysisService = createAnalysisService(AnalysisModel, analysisOptions);

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    }),
  );

  app.get("/api/health", (_request, response) => {
    const connected = databaseConnected();
    response.status(connected ? 200 : 503).json({
      status: connected ? "ok" : "unavailable",
      database: connected ? "connected" : "disconnected",
    });
  });

  app.get("/", (_request, response) => {
    response.json({ name: "0 to Shipped Resume Parser API", status: "ok" });
  });

  app.use("/api/analyses", createAnalysisRouter(analysisService));
  app.use(errorHandler);

  return app;
}
