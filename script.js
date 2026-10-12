const fileInput = document.querySelector("#resume-file");
const dropZone = document.querySelector("#drop-zone");
const dropZoneContent = document.querySelector("#drop-zone-content");
const browseButton = document.querySelector("#browse-button");
const selectedFile = document.querySelector("#selected-file");
const fileName = document.querySelector("#file-name");
const fileSize = document.querySelector("#file-size");
const removeFileButton = document.querySelector("#remove-file");
const analyzeButton = document.querySelector("#analyze-button");
const uploadError = document.querySelector("#upload-error");
const reportOverline = document.querySelector("#report-overline");
const reportTitle = document.querySelector("#report-title");
const demoBadge = document.querySelector("#demo-badge");
const reportFootnote = document.querySelector("#report-footnote");

const maxFileSize = 10 * 1024 * 1024;
let selectedResume = null;
let analysisTimer;

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showError(message) {
  uploadError.textContent = message;
  uploadError.hidden = false;
}

function clearError() {
  uploadError.textContent = "";
  uploadError.hidden = true;
}

function resetReport() {
  reportOverline.textContent = "YOUR PREVIEW";
  reportTitle.textContent = "A snapshot of your strengths.";
  demoBadge.innerHTML = "<span></span> SAMPLE";
  reportFootnote.innerHTML =
    '<span aria-hidden="true">✳</span> Example results shown — upload a PDF to see the demo flow.';
}

function selectFile(file) {
  clearError();

  if (!file) {
    return;
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showError("Please choose a PDF file to continue.");
    return;
  }

  if (file.size > maxFileSize) {
    showError("That file is a bit too large. Please choose a PDF under 10 MB.");
    return;
  }

  if (file.size === 0) {
    showError("That file appears to be empty. Please choose another PDF.");
    return;
  }

  selectedResume = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  selectedFile.hidden = false;
  dropZoneContent.hidden = true;
  analyzeButton.disabled = false;
}

function clearSelection() {
  window.clearTimeout(analysisTimer);
  selectedResume = null;
  fileInput.value = "";
  selectedFile.hidden = true;
  dropZoneContent.hidden = false;
  analyzeButton.disabled = true;
  analyzeButton.classList.remove("is-loading");
  analyzeButton.querySelector(".button-label").textContent = "Take a look";
  analyzeButton.querySelector("svg").hidden = false;
  clearError();
  resetReport();
}

browseButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  selectFile(fileInput.files[0]);
});

removeFileButton.addEventListener("click", clearSelection);

analyzeButton.addEventListener("click", () => {
  if (!selectedResume || analyzeButton.disabled) {
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.classList.add("is-loading");
  analyzeButton.querySelector(".button-label").textContent = "Putting together your preview";
  analyzeButton.querySelector("svg").hidden = true;

  analysisTimer = window.setTimeout(() => {
    reportOverline.textContent = "DEMO RESULTS";
    reportTitle.textContent = selectedResume.name;
    demoBadge.innerHTML = "<span></span> MOCK ANALYSIS";
    reportFootnote.innerHTML =
      '<span aria-hidden="true">✳</span> This is a sample report — your PDF hasn’t been parsed.';
    analyzeButton.disabled = false;
    analyzeButton.classList.remove("is-loading");
    analyzeButton.querySelector(".button-label").textContent = "Preview updated";
    analyzeButton.querySelector("svg").hidden = false;
    document.querySelector("#report-title").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
  }, 650);
});

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
}

dropZone.addEventListener("drop", (event) => {
  selectFile(event.dataTransfer.files[0]);
});
