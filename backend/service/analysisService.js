import { createMockAnalysis } from "./mockAnalysis.js";

export function createAnalysisService(AnalysisModel) {
  return {
    async create({ resume, jobDescription }) {
      const analysisData = createMockAnalysis({
        resumeFileName: resume.originalname,
        resumeSize: resume.size,
        jobDescription,
      });

      return AnalysisModel.create(analysisData);
    },
  };
}
