import assert from "node:assert/strict";
import test from "node:test";
import {
  AnalysisError,
  extractResumeText,
  requestLabdAnalysis,
} from "../service/analysisService.js";

function createTextPdf(text) {
  const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];

  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(document));
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(document);
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  document += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(document);
}

test("extractResumeText extracts selectable text from a PDF", async () => {
  const text = await extractResumeText(createTextPdf("Resume text extraction works"));

  assert.match(text, /Resume text extraction works/);
});

test("requestLabdAnalysis sends resume and job description with the server-side key", async (t) => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(
      JSON.stringify({
        message: {
          content: JSON.stringify({
            score: 91,
            matchedSkills: [" React ", "React", "TypeScript"],
            missingSkills: ["AWS"],
            summary: "Strong match for the role.",
          }),
        },
        credits: { percentLeft: 73 },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const result = await requestLabdAnalysis({
    resumeText: "React and TypeScript experience",
    jobDescription: "Build React applications",
    apiKey: "test-only-key",
  });

  assert.equal(request.url, "https://agent.thedevlabs.io/v1/api/chat");
  assert.equal(request.options.headers.Authorization, "test-only-key");
  const body = JSON.parse(request.options.body);
  assert.match(body.messages[0].content, /React and TypeScript experience/);
  assert.match(body.messages[0].content, /Build React applications/);
  assert.deepEqual(result, {
    score: 91,
    matchedSkills: ["React", "TypeScript"],
    missingSkills: ["AWS"],
    summary: "Strong match for the role.",
    creditsPercentLeft: 73,
  });
});

test("requestLabdAnalysis maps Labd allowance errors to an actionable status", async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("{}", { status: 402 });
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(
    requestLabdAnalysis({
      resumeText: "Resume text",
      jobDescription: "Role description",
      apiKey: "test-only-key",
    }),
    (error) =>
      error instanceof AnalysisError &&
      error.statusCode === 503 &&
      /allowance is used up/.test(error.message),
  );
});

test("requestLabdAnalysis rejects results that do not match the expected JSON shape", async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({
      message: { content: '{"score": 120, "matchedSkills": [], "missingSkills": [], "summary": "Invalid"}' },
    });
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(
    requestLabdAnalysis({
      resumeText: "Resume text",
      jobDescription: "Role description",
      apiKey: "test-only-key",
    }),
    (error) => error instanceof AnalysisError && /incomplete result/.test(error.message),
  );
});
