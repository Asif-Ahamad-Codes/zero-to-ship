import cors from "cors";
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Analysis from "./models/Analysis.js";
import { createMockAnalysis } from "./services/mockAnalysis.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_JOB_DESCRIPTION_LENGTH = 50000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 1,
    fieldSize: MAX_JOB_DESCRIPTION_LENGTH * 4,
  },
});

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

export function createApp({ AnalysisModel = Analysis } = {}) {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    }),
  );

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  app.post(
    "/api/analyses",
    upload.single("resume"),
    asyncRoute(async (request, response) => {
      const resume = request.file;
      const jobDescription =
        typeof request.body.jobDescription === "string" ? request.body.jobDescription.trim() : "";

      if (!resume) {
        return response.status(400).json({ error: "Please attach a PDF resume." });
      }

      if (resume.buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
        return response.status(400).json({ error: "The uploaded file is not a valid PDF." });
      }

      if (!jobDescription) {
        return response.status(400).json({ error: "Please provide a job description." });
      }

      if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
        return response
          .status(400)
          .json({ error: "The job description must be 50,000 characters or fewer." });
      }

      const analysisData = createMockAnalysis({
        resumeFileName: resume.originalname,
        resumeSize: resume.size,
        jobDescription,
      });
      const analysis = await AnalysisModel.create(analysisData);

      return response.status(201).json({
        analysis: {
          id: analysis.id,
          resumeFileName: analysis.resumeFileName,
          resumeSize: analysis.resumeSize,
          score: analysis.score,
          matchedSkills: analysis.matchedSkills,
          missingSkills: analysis.missingSkills,
          isMock: analysis.isMock,
          createdAt: analysis.createdAt,
        },
      });
    }),
  );

  app.use((error, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return response.status(413).json({ error: "The PDF must be 10 MB or smaller." });
      }

      if (error.code === "LIMIT_FIELD_VALUE") {
        return response
          .status(400)
          .json({ error: "The job description must be 50,000 characters or fewer." });
      }

      return response.status(400).json({ error: "Please upload one PDF and a job description." });
    }

    console.error("Request failed:", error);
    return response.status(500).json({ error: "The comparison could not be saved." });
  });

  return app;
}
