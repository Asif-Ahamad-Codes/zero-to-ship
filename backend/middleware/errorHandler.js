import multer from "multer";
import { MAX_FILE_SIZE, MAX_JOB_DESCRIPTION_LENGTH } from "./upload.js";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(413).json({
        error: `The PDF must be ${MAX_FILE_SIZE / (1024 * 1024)} MB or smaller.`,
      });
    }

    if (error.code === "LIMIT_FIELD_VALUE") {
      return response.status(400).json({
        error: `The job description must be ${MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()} characters or fewer.`,
      });
    }

    return response.status(400).json({ error: "Please upload one PDF and a job description." });
  }

  console.error("Request failed:", error);
  return response.status(500).json({ error: "The comparison could not be saved." });
}
