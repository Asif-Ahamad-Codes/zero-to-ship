import { MAX_JOB_DESCRIPTION_LENGTH } from "../middleware/upload.js";
import { hasPdfSignature } from "../utils.js";

export function createAnalysisController(analysisService) {
  return {
    async create(request, response) {
      const resume = request.file;
      const jobDescription =
        typeof request.body.jobDescription === "string" ? request.body.jobDescription.trim() : "";

      if (!resume) {
        return response.status(400).json({ error: "Please attach a PDF resume." });
      }

      if (!hasPdfSignature(resume.buffer)) {
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

      const analysis = await analysisService.create({ resume, jobDescription });

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
    },
  };
}
