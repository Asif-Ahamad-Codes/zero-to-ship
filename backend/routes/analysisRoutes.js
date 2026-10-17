import { Router } from "express";
import { createAnalysisController } from "../controller/analysisController.js";
import { uploadResume } from "../middleware/upload.js";
import { asyncHandler } from "../utils.js";

export function createAnalysisRouter(analysisService) {
  const router = Router();
  const controller = createAnalysisController(analysisService);

  router.post("/", uploadResume.single("resume"), asyncHandler(controller.create));

  return router;
}
