export function createMockAnalysis({ resumeFileName, resumeSize, jobDescription }) {
  return {
    resumeFileName,
    resumeSize,
    jobDescription,
    score: 82,
    matchedSkills: ["React", "TypeScript", "Node.js", "REST APIs", "Git"],
    missingSkills: ["Automated testing", "AWS", "CI/CD"],
    isMock: true,
  };
}
