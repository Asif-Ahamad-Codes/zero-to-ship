import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../src/app.js";

async function startTestServer() {
  const createdRecords = [];
  const app = createApp({
    AnalysisModel: {
      async create(document) {
        const record = {
          ...document,
          id: "mock-analysis-id",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        };
        createdRecords.push(record);
        return record;
      },
    },
  });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  return {
    createdRecords,
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
}

function createForm({ pdf = true, jobDescription = "Build and maintain a React application." } = {}) {
  const form = new FormData();

  if (pdf) {
    form.append("resume", new Blob(["%PDF-1.7\nmock resume"], { type: "application/pdf" }), "resume.pdf");
  }

  if (jobDescription !== null) {
    form.append("jobDescription", jobDescription);
  }

  return form;
}

test("POST /api/analyses stores a mock comparison without storing the PDF", async (t) => {
  const server = await startTestServer();
  t.after(server.close);

  const response = await fetch(`${server.url}/api/analyses`, {
    method: "POST",
    body: createForm(),
  });
  const payload = await response.json();

  assert.equal(response.status, 201);
  assert.equal(payload.analysis.score, 82);
  assert.equal(payload.analysis.isMock, true);
  assert.deepEqual(payload.analysis.matchedSkills, ["React", "TypeScript", "Node.js", "REST APIs", "Git"]);
  assert.equal(server.createdRecords.length, 1);
  assert.equal("resumeBuffer" in server.createdRecords[0], false);
  assert.equal(server.createdRecords[0].jobDescription, "Build and maintain a React application.");
});

test("POST /api/analyses rejects a request without a PDF", async (t) => {
  const server = await startTestServer();
  t.after(server.close);

  const response = await fetch(`${server.url}/api/analyses`, {
    method: "POST",
    body: createForm({ pdf: false }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /attach a PDF/i);
  assert.equal(server.createdRecords.length, 0);
});

test("POST /api/analyses rejects a non-PDF file", async (t) => {
  const server = await startTestServer();
  t.after(server.close);
  const form = new FormData();
  form.append("resume", new Blob(["not a pdf"], { type: "application/pdf" }), "resume.pdf");
  form.append("jobDescription", "Build and maintain a React application.");

  const response = await fetch(`${server.url}/api/analyses`, {
    method: "POST",
    body: form,
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid PDF/i);
  assert.equal(server.createdRecords.length, 0);
});

test("POST /api/analyses rejects a missing job description", async (t) => {
  const server = await startTestServer();
  t.after(server.close);

  const response = await fetch(`${server.url}/api/analyses`, {
    method: "POST",
    body: createForm({ jobDescription: null }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /job description/i);
  assert.equal(server.createdRecords.length, 0);
});
