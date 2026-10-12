import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12m-5-5 5 5-5 5" />
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="#" aria-label="0 to Shipped home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M7 22.5 14.5 15l4 4L26 11.5" />
          <path d="M19.5 11.5H26V18" />
          <path d="M7 26.5h19" />
        </svg>
      </span>
      <span className="brand-name">
        0 to <span>Shipped</span>
      </span>
    </a>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          YOUR NEXT CHAPTER STARTS HERE
        </div>
        <h1 id="hero-title">
          Your resume,
          <br />
          with a <span>little more</span>
          <br />
          direction.
        </h1>
        <p className="hero-description">
          Get a clearer picture of how your resume stacks up. See your score, the skills you’re
          showing off, and what might be missing.
        </p>
        <a className="primary-button hero-button" href="#analyzer">
          Check your resume
          <ArrowIcon />
        </a>
        <div className="hero-note">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2.5 16 5v4.6c0 3.7-2.5 6.3-6 7.9-3.5-1.6-6-4.2-6-7.9V5l6-2.5Z" />
            <path d="m7.5 9.8 1.7 1.7 3.4-3.6" />
          </svg>
          A low-pressure first look. No account needed.
        </div>
      </div>

      <div className="hero-art" aria-label="Resume score preview">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-sparkle sparkle-one" aria-hidden="true">
          ✳
        </div>
        <div className="art-sparkle sparkle-two" aria-hidden="true">
          ✳
        </div>

        <article className="preview-card">
          <div className="preview-topline">
            <span className="preview-label">RESUME SNAPSHOT</span>
            <span className="sample-tag">
              <span /> SAMPLE
            </span>
          </div>
          <div className="score-row">
            <div className="score-ring" aria-label="Sample match score: 82 out of 100">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="ring-track" cx="60" cy="60" r="50" />
                <circle className="ring-progress" cx="60" cy="60" r="50" />
              </svg>
              <div className="ring-content">
                <span className="score-number">82</span>
                <span className="score-out-of">/ 100</span>
              </div>
            </div>
            <div className="score-context">
              <span className="score-caption">YOUR MATCH SCORE</span>
              <h2>A strong start.</h2>
              <p>You’ve got some great skills to build on.</p>
            </div>
          </div>

          <div className="preview-divider" />
          <div className="preview-skills">
            <div className="preview-skill-heading">
              <span>Skills at a glance</span>
              <span className="skill-count">5 found</span>
            </div>
            <div className="skill-chips" aria-label="Example matched skills">
              <span className="skill-chip">
                <span>✓</span> React
              </span>
              <span className="skill-chip">
                <span>✓</span> TypeScript
              </span>
              <span className="skill-chip">
                <span>✓</span> Node.js
              </span>
              <span className="skill-chip">
                <span>✓</span> REST APIs
              </span>
              <span className="skill-chip skill-chip-missing">
                <span>+</span> Testing
              </span>
              <span className="skill-chip skill-chip-missing">
                <span>+</span> AWS
              </span>
            </div>
          </div>
          <div className="preview-footer">
            <span className="footer-avatar" aria-hidden="true">
              ✳
            </span>
            <span>A little insight goes a long way.</span>
            <ArrowIcon />
          </div>
        </article>

        <div className="floating-note">
          <span className="floating-note-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5 10.5 8.2 14 15 6.5" />
            </svg>
          </span>
          <span>
            <strong>5 skills matched</strong>
            <small>Nice work!</small>
          </span>
        </div>
      </div>
    </section>
  );
}

function UploadCard({
  fileInputRef,
  file,
  error,
  isAnalyzing,
  isAnalyzed,
  onFileSelected,
  onRemoveFile,
  onAnalyze,
}) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    onFileSelected(event.dataTransfer.files[0]);
  }

  return (
    <div className="upload-card">
      <div className="upload-card-heading">
        <span className="step-number">01</span>
        <div>
          <h3>Your resume</h3>
          <p>Start with a PDF of your latest resume.</p>
        </div>
      </div>

      <div
        className={`drop-zone${isDragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Choose a PDF resume"
          onChange={(event) => {
            onFileSelected(event.target.files[0]);
            event.target.value = "";
          }}
        />
        {!file && (
          <div className="drop-zone-content">
            <div className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 21V7m0 0-5 5m5-5 5 5" />
                <path d="M8 19v7h16v-7" />
              </svg>
            </div>
            <strong>Drop your resume here</strong>
            <span>
              or{" "}
              <button
                className="browse-button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                browse files
              </button>
            </span>
            <small>PDF only · Up to 10 MB</small>
          </div>
        )}
      </div>

      {file && (
        <div className="selected-file">
          <span className="file-badge" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5.5 2.5h6l4 4v11h-10v-15Z" />
              <path d="M11.5 2.5v4h4m-7 4h4m-4 3h4" />
            </svg>
          </span>
          <span className="file-info">
            <strong>{file.name}</strong>
            <small>{formatFileSize(file.size)}</small>
          </span>
          <button
            className="remove-file"
            type="button"
            aria-label="Remove selected file"
            onClick={onRemoveFile}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m6 6 8 8m0-8-8 8" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}

      <button
        className={`primary-button analyze-button${isAnalyzing ? " is-loading" : ""}`}
        type="button"
        disabled={!file || isAnalyzing}
        onClick={onAnalyze}
      >
        <span className="button-label">
          {isAnalyzing
            ? "Putting together your preview"
            : isAnalyzed
              ? "Preview updated"
              : "Take a look"}
        </span>
        {!isAnalyzing && <ArrowIcon />}
      </button>
      <p className="privacy-note">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.8 13 4v3.8c0 3.1-2.1 5.3-5 6.6-2.9-1.3-5-3.5-5-6.6V4l5-2.2Z" />
        </svg>
        Your resume stays right here in your browser.
      </p>
    </div>
  );
}

function ResumeReport({ file, isAnalyzed, reportTitleRef }) {
  return (
    <article className="report-card" aria-live="polite" aria-labelledby="report-title">
      <div className="report-header">
        <div>
          <span className="report-overline">{isAnalyzed ? "DEMO RESULTS" : "YOUR PREVIEW"}</span>
          <h3 id="report-title" ref={reportTitleRef}>
            {isAnalyzed ? file.name : "A snapshot of your strengths."}
          </h3>
        </div>
        <span className="demo-badge">
          <span /> {isAnalyzed ? "MOCK ANALYSIS" : "SAMPLE"}
        </span>
      </div>

      <div className="report-score-row">
        <div className="report-score">
          82<span>/100</span>
        </div>
        <div className="report-score-description">
          <strong>Looking promising</strong>
          <span>There’s a solid foundation here.</span>
        </div>
      </div>

      <div className="report-divider" />

      <div className="report-skill-group">
        <div className="report-group-title">
          <span className="group-indicator present-indicator" />
          Skills you have
          <span className="group-count">5</span>
        </div>
        <div className="report-chips">
          <span>React</span>
          <span>TypeScript</span>
          <span>Node.js</span>
          <span>REST APIs</span>
          <span>Git</span>
        </div>
      </div>

      <div className="report-skill-group missing-group">
        <div className="report-group-title">
          <span className="group-indicator missing-indicator" />
          Skills to explore
          <span className="group-count">3</span>
        </div>
        <div className="report-chips missing-chips">
          <span>Automated testing</span>
          <span>AWS</span>
          <span>CI/CD</span>
        </div>
      </div>

      <p className="report-footnote">
        <span aria-hidden="true">✳</span>{" "}
        {isAnalyzed
          ? "This is a sample report — your PDF hasn’t been parsed."
          : "Example results shown — upload a PDF to see the demo flow."}
      </p>
    </article>
  );
}

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="how-intro">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          NO BIG MYSTERY
        </div>
        <h2 id="how-title">
          A few steps closer
          <br />
          to your next yes.
        </h2>
        <p>Job searching is enough work already. Start with a little more clarity.</p>
      </div>
      <div className="how-steps">
        <article className="how-step">
          <span className="step-icon upload-step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
              <path d="M5 15v5h14v-5" />
            </svg>
          </span>
          <span className="step-caption">01 — DROP IT IN</span>
          <h3>Bring your resume</h3>
          <p>Start with a PDF. Simple as that.</p>
        </article>
        <article className="how-step">
          <span className="step-icon score-step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.2 2" />
            </svg>
          </span>
          <span className="step-caption">02 — GET THE PICTURE</span>
          <h3>See your snapshot</h3>
          <p>A score gives you a place to start.</p>
        </article>
        <article className="how-step">
          <span className="step-icon skills-step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m5 12 4.2 4.2L19 6.5" />
              <path d="M19 12v6H5V6h9" />
            </svg>
          </span>
          <span className="step-caption">03 — FIND YOUR NEXT STEP</span>
          <h3>Spot your skills</h3>
          <p>See what’s there and what to explore.</p>
        </article>
      </div>
    </section>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const fileInputRef = useRef(null);
  const reportTitleRef = useRef(null);
  const analysisTimerRef = useRef(null);

  useEffect(() => {
    if (isAnalyzed) {
      reportTitleRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [isAnalyzed]);

  useEffect(
    () => () => {
      window.clearTimeout(analysisTimerRef.current);
    },
    [],
  );

  function handleFileSelected(nextFile) {
    window.clearTimeout(analysisTimerRef.current);
    setIsAnalyzing(false);
    setIsAnalyzed(false);
    setError("");

    if (!nextFile) {
      return;
    }

    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setError("Please choose a PDF file to continue.");
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("That file is a bit too large. Please choose a PDF under 10 MB.");
      return;
    }

    if (nextFile.size === 0) {
      setFile(null);
      setError("That file appears to be empty. Please choose another PDF.");
      return;
    }

    setFile(nextFile);
  }

  function handleRemoveFile() {
    window.clearTimeout(analysisTimerRef.current);
    setFile(null);
    setError("");
    setIsAnalyzing(false);
    setIsAnalyzed(false);
  }

  function handleAnalyze() {
    if (!file || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    analysisTimerRef.current = window.setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 650);
  }

  return (
    <>
      <header className="site-header">
        <Brand />
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#analyzer">The analyzer</a>
        </nav>
        <a className="header-cta" href="#analyzer">
          Try it free
          <ArrowIcon />
        </a>
      </header>

      <main>
        <Hero />

        <section className="analyzer-section" id="analyzer" aria-labelledby="analyzer-title">
          <div className="section-heading">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A BETTER STARTING POINT
            </div>
            <h2 id="analyzer-title">Let’s take a look.</h2>
            <p>Drop in your resume and get a feel for where you stand.</p>
          </div>

          <div className="analyzer-layout">
            <UploadCard
              fileInputRef={fileInputRef}
              file={file}
              error={error}
              isAnalyzing={isAnalyzing}
              isAnalyzed={isAnalyzed}
              onFileSelected={handleFileSelected}
              onRemoveFile={handleRemoveFile}
              onAnalyze={handleAnalyze}
            />
            <ResumeReport file={file} isAnalyzed={isAnalyzed} reportTitleRef={reportTitleRef} />
          </div>
          <p className="demo-disclaimer">
            Just exploring? This is a design demo — uploaded files aren’t parsed, and the sample
            results aren’t based on your resume.
          </p>
        </section>

        <HowItWorks />
      </main>

      <footer className="site-footer">
        <Brand footer />
        <p>A small step for your next big thing.</p>
        <span className="footer-copyright">A little resume-parser demo · 2026</span>
      </footer>
    </>
  );
}
