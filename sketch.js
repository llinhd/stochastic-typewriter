
let myInput;
let lockedLayer;
let canvasElement;
let customFont;
let baseFont;
let textX= 0;
let textY = 80;
let paperColor = "#f9f1f1";
let textPosition = "top";
let viewMode = "digital";
let mic;
let fft;
let currentMin = 0;
let currentMax = 255;
const PRINT_TARGET_MIN = 24;
const PRINT_TARGET_MAX = 80;
const DIGITAL_TARGET_MIN = 40;
const DIGITAL_TARGET_MAX = 150;
let targetMin = PRINT_TARGET_MIN;
let targetMax = PRINT_TARGET_MAX;
let switchSizeWeight = true;
let weightMin = 300;
let weightMax = 900;



let bassValue = 0;
let midValue = 0;
let dynamicSize = 20;
let dynamicWeight = 400;
let dynamicY = 200;
let dynamicX = 20;
let dynamicBlur

let elavateStartSlider, elavateEndSlider;
let opaStartSlider, opaEndSlider;
let sizeStartSlider, sizeEndSlider;
let variableStartSlider, variableEndSlider;
let highStartSlider;
let highEndSlider;
let rotateStartSlider, rotateEndSlider;
let spacingStartSlider, spacingEndSlider;
let lowGroupSwitch, midGroupSwitch, trebleGroupSwitch;
let elavateSwitch, opacitySwitch, sizeSwitch, weightSwitch, highSwitch, rotateSwitch, spacingSwitch;
let currentPageIndex = 0;
let allPages = [[]]
let activeBook = "1";
let introActive = true;
let savedLines;
let writingPlaceholder = "start your work";
let pageDrafts = {};
let storedData = localStorage.getItem("myCanvasText_"+ activeBook);
let mediaRecorder;
let recordedChunks = [];
let recordingAudioStream;
const API_PORT = "8767";
const PAGE_LINE_LIMIT = 20;
const CANVAS_PIXEL_DENSITY = 2;
const VIDEO_BITS_PER_SECOND = 12000000;
const LOW_SOUND_THRESHOLD = 8;
// This tool can be opened from a larger local project on any port. In that
// case, keep its writing API connected to this tool's server on port 8767.
const isLocalPage = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
let apiBase = isLocalPage && window.location.port !== API_PORT
  ? `http://${window.location.hostname}:${API_PORT}`
  : "";
const CONTRIBUTION_COLORS = ["#ffd6e0", "#d9f2d0", "#cfe8ff", "#ffe7b8", "#e4d7ff", "#ccefe8"];
const BOOK4_PAGE_PROMPT = "who are you without your problems?";
const BOOK5_LINE_PREFIX = "All is ";
// These are the starting pages shown on GitHub Pages. They were exported from
// the local SQLite database so the public site does not need a Python server.
const DEFAULT_BOOK_PAGES = {
  "1": [[
    { text: "this is my doy,", contributionId: "contribution-1783983412372-zali74", color: "#ffe7b8" },
    { text: "i sow someone i hete on the street todey", contributionId: "contribution-1783983412372-zali74", color: "#ffe7b8" },
    { text: "which mekes me hote myself even more", contributionId: "contribution-1783983412372-zali74", color: "#ffe7b8" },
    { text: "those deys pussed by ", contributionId: "contribution-1783983442150-0pf9bl", color: "#ffd6e0" },
    { text: "like euting i cotton condy in e derk room ill olone", contributionId: "contribution-1783983484023-shup1k", color: "#e4d7ff" }
  ]],
  "2": [[
    { text: "ssso whatttt arrre you tttrrying tttto sssay?", contributionId: "contribution-1783983520771-999x15", color: "#e4d7ff" },
    { text: "i'm nottt ggggonna hear itttt", contributionId: "contribution-1783983539639-1mgrxl", color: "#d9f2d0" },
    { text: "rrrememberrrr tto brreatttthe bbbbefffforrre you spppeak", contributionId: "contribution-1783983600116-npqthu", color: "#ccefe8" }
  ]],
  "3": [[
    { text: "morning!!!!", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "it's 6 am ", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "getting myself a 5 cups of cofffee", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "then i woke up again", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "i never wake up at 6 am", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "that's bullshit", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "do i have to go to work today?", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "but then, i woke up", contributionId: "contribution-1783983733552-3pffny", color: "#ffd6e0" },
    { text: "so it's another dream", contributionId: "contribution-1783983767094-4dqlsb", color: "#cfe8ff" },
    { text: "i'm still lying on the kitchen floor", contributionId: "contribution-1783983821202-gre6d0", color: "#cfe8ff" },
    { text: "after 5 cups of coffee", contributionId: "contribution-1783983821202-gre6d0", color: "#cfe8ff" },
    { text: "at 3:40 am", contributionId: "contribution-1783983821202-gre6d0", color: "#cfe8ff" },
    { text: "then i woke up again", contributionId: "contribution-1783983821202-gre6d0", color: "#cfe8ff" },
    { text: "that shit happens again", contributionId: "contribution-1783983836748-uxcbwo", color: "#ffe7b8" }
  ]],
  "4": [[
    { text: "who are you without your problems?", contributionId: "book-4-prompt", color: null },
    { text: "an owl", contributionId: "contribution-1783983867672-4hlgn8", color: "#ffd6e0" },
    { text: "a noon owl", contributionId: "contribution-1783983889112-rijwk6", color: "#ffe7b8" },
    { text: "who are you without your problems?", contributionId: "contribution-1783983889112-rijwk6", color: "#ffe7b8" },
    { text: "i am the problem", contributionId: "contribution-1783983931513-uxwjhb", color: "#ccefe8" },
    { text: "who are you without your problems?", contributionId: "contribution-1783983931513-uxwjhb", color: "#ccefe8" },
    { text: "but no one knows about it", contributionId: "contribution-1783983931513-uxwjhb", color: "#ccefe8" }
  ]],
  "5": [[
    { text: "All is burning", contributionId: "contribution-1783983989485-yi5xvi", color: "#e4d7ff" },
    { text: "All is falling", contributionId: "contribution-1783983989485-yi5xvi", color: "#e4d7ff" },
    { text: "All is changing", contributionId: "contribution-1783983989485-yi5xvi", color: "#e4d7ff" },
    { text: "All is flipping pages", contributionId: "contribution-1783983989485-yi5xvi", color: "#e4d7ff" },
    { text: "All is all", contributionId: "contribution-1783983989485-yi5xvi", color: "#e4d7ff" },
    { text: "All is crafted", contributionId: "contribution-1783984046145-7alhtx", color: "#e4d7ff" }
  ]]
};
const INTRO_LINES = [
  "How does poetry survive, transform, and mutate in a world saturated with distractions and noise?",
  "Fill these empty pages with your own words.",
  "Carry on the unfinished story.",
  "A collision of voices is formed in these collective stories.",
  "Then, let your surroundings read the pages.",
  "Let the wind scatter the letters and the noise shatter the grid.",
  "A poetic distortion is shaped by everything around you."
];

function lineText(line) {
  return typeof line === "string" ? line : (line && typeof line.text === "string" ? line.text : "");
}

function contributionColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return CONTRIBUTION_COLORS[Math.abs(hash) % CONTRIBUTION_COLORS.length];
}

function createContribution(lines) {
  let id = `contribution-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let color = contributionColor(id);
  return lines.map((text) => ({ text, contributionId: id, color }));
}

function normalizeLine(line) {
  if (typeof line === "string") return { text: line, contributionId: null, color: null };
  if (line && typeof line.text === "string") {
    return {
      text: line.text,
      contributionId: line.contributionId || null,
      color: line.color || (line.contributionId ? contributionColor(line.contributionId) : null)
    };
  }
  return { text: "", contributionId: null, color: null };
}

function normalizePages(data) {
  let pages;
  if (Array.isArray(data) && Array.isArray(data[0])) {
    pages = data;
  } else if (Array.isArray(data)) {
    pages = [data];
  } else {
    pages = [[]];
  }

  let paginatedPages = [];
  for (let page of pages) {
    let lines = Array.isArray(page) ? page.map(normalizeLine) : [];
    for (let i = 0; i < lines.length; i += PAGE_LINE_LIMIT) {
      paginatedPages.push(lines.slice(i, i + PAGE_LINE_LIMIT));
    }
  }

  return paginatedPages.length > 0 ? paginatedPages : [[]];
}

function defaultPagesForBook(bookId) {
  return normalizePages(JSON.parse(JSON.stringify(DEFAULT_BOOK_PAGES[bookId] || [[]])));
}

function getTypedLines() {
  let text = myInput.innerText;
  if (!text.trim()) return [];

  let lines = text.split('\n');
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }
  return lines;
}

function currentDraftKey() {
  return `${activeBook}-${currentPageIndex}`;
}

function isCurrentPageFull() {
  return (allPages[currentPageIndex] || []).length >= PAGE_LINE_LIMIT;
}

function ensurePageStarter() {
  if (activeBook !== "4") return;
  if (!allPages[currentPageIndex]) allPages[currentPageIndex] = [];
  if (allPages[currentPageIndex].length === 0) {
    allPages[currentPageIndex].push({ text: BOOK4_PAGE_PROMPT, contributionId: "book-4-prompt", color: null });
  }
}

function currentPageDraft() {
  let key = currentDraftKey();
  if (Object.prototype.hasOwnProperty.call(pageDrafts, key)) return pageDrafts[key];
  return activeBook === "5" && !isCurrentPageFull() ? BOOK5_LINE_PREFIX : "";
}

function stashCurrentDraft() {
  if (!myInput || isCurrentPageFull()) return;
  pageDrafts[currentDraftKey()] = myInput.innerText;
}

function updatePageFullState() {
  if (!myInput) return;
  let isFull = isCurrentPageFull();
  let saveButton = document.querySelector("#save-line");
  myInput.contentEditable = isFull ? "false" : "true";
  myInput.dataset.placeholder = introActive
    ? "pick a folder and start writing together"
    : (isFull ? "this page is full" : writingPlaceholder);
  if (saveButton) saveButton.disabled = isFull;
}

function limitDraftToPage() {
  if (!myInput || isCurrentPageFull()) return;
  let availableLines = PAGE_LINE_LIMIT - (allPages[currentPageIndex] || []).length;
  let draftLines = myInput.innerText.split("\n");
  if (myInput.innerText === "" || draftLines.length <= availableLines) return;

  myInput.innerText = draftLines.slice(0, availableLines).join("\n");
  focusTextInput();
}

function ensureAllIsPrefix() {
  if (!myInput || activeBook !== "5" || isCurrentPageFull()) return;
  let draft = myInput.innerText;
  let prefixedDraft = draft.split("\n").map((line) => (
    line.startsWith(BOOK5_LINE_PREFIX) ? line : BOOK5_LINE_PREFIX + line
  )).join("\n");

  if (draft !== prefixedDraft) {
    myInput.innerText = prefixedDraft;
    focusTextInput();
  }
}

function commitTypedLines() {
  let newLines = createContribution(getTypedLines());
  if (newLines.length === 0) return false;
  if (isCurrentPageFull()) return false;

  let availableLines = PAGE_LINE_LIMIT - (allPages[currentPageIndex] || []).length;
  if (newLines.length > availableLines) return false;
  allPages[currentPageIndex] = (allPages[currentPageIndex] || []).concat(newLines);
  return true;
}

function showSavedLines() {
  lockedLayer.replaceChildren();
  savedLines.forEach((line, index) => {
    let lineElement = document.createElement("span");
    lineElement.className = "saved-line";
    lineElement.textContent = lineText(line);
    if (line.color) lineElement.style.setProperty("--contribution-color", line.color);
    lockedLayer.appendChild(lineElement);
    if (index < savedLines.length - 1) lockedLayer.appendChild(document.createElement("br"));
  });
}

function placeCaretAtEnd() {
  let range = document.createRange();
  let selection = window.getSelection();
  range.selectNodeContents(myInput);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function focusTextInput() {
  if (myInput.contentEditable === "false") return;
  myInput.focus();
  placeCaretAtEnd();
}

function countWrappedRows(line) {
  if (!line.trim()) return 0;

  let style = window.getComputedStyle(myInput);
  let availableWidth = myInput.clientWidth;
  let canvas = countWrappedRows.canvas || document.createElement("canvas");
  let context = canvas.getContext("2d");
  countWrappedRows.canvas = canvas;
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  let rows = 1;
  let currentRow = "";
  let words = line.split(/(\s+)/);

  for (let word of words) {
    let nextRow = currentRow + word;
    if (context.measureText(nextRow).width <= availableWidth) {
      currentRow = nextRow;
      continue;
    }

    if (currentRow.trim() !== "") {
      rows++;
      currentRow = word.trimStart();
    }

    while (context.measureText(currentRow).width > availableWidth && currentRow.length > 1) {
      let cutIndex = currentRow.length;
      while (cutIndex > 1 && context.measureText(currentRow.slice(0, cutIndex)).width > availableWidth) {
        cutIndex--;
      }
      rows++;
      currentRow = currentRow.slice(cutIndex);
    }
  }

  return rows;
}

function countVisualRows(lines) {
  return lines.reduce((total, line) => total + countWrappedRows(line), 0);
}

function getCanvasFont(weight, size) {
  let activeFontFamily = customFont ? 'CustomUploadedFont' : 'Roboto';
  return `${weight} ${size}px "${activeFontFamily}"`;
}

function getLetterSpacing(index, trebleValue, spacing) {
  if (trebleValue <= 0 || !spacingSwitch.checked) return 0;

  let noiseSpacing = noise((frameCount * 0.03) + index);
  if (trebleValue <= 60) {
    return map(noiseSpacing, 0, 1, 0, 10) * spacing;
  }
  return map(noiseSpacing, 0, 1, 10, 50) * spacing;
}

function getCenteredLineWidth(text, canvasFont, trebleValue, spacing) {
  drawingContext.font = canvasFont;
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += drawingContext.measureText(text[i]).width;
    if (i < text.length - 1) {
      totalWidth += getLetterSpacing(i, trebleValue, spacing);
    }
  }
  return totalWidth;
}

function useRightAlignmentForLine(text, index) {
  let hash = index;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0;
}

function wrapCanvasTextRows(text, canvasFont, maxWidth, trebleValue, spacing) {
  let rows = [];
  let currentRow = "";
  let parts = text.split(/(\s+)/);

  for (let part of parts) {
    let candidate = currentRow + part;
    if (getCenteredLineWidth(candidate, canvasFont, trebleValue, spacing) <= maxWidth) {
      currentRow = candidate;
      continue;
    }

    if (currentRow.trim() !== "") {
      rows.push(currentRow.trimEnd());
      currentRow = part.trimStart();
    }

    while (getCenteredLineWidth(currentRow, canvasFont, trebleValue, spacing) > maxWidth && currentRow.length > 1) {
      let cutIndex = currentRow.length;
      while (cutIndex > 1 && getCenteredLineWidth(currentRow.slice(0, cutIndex), canvasFont, trebleValue, spacing) > maxWidth) {
        cutIndex--;
      }
      rows.push(currentRow.slice(0, cutIndex));
      currentRow = currentRow.slice(cutIndex);
    }
  }

  if (currentRow.trim() !== "") {
    rows.push(currentRow.trimEnd());
  }
  return rows.length > 0 ? rows : [text];
}

// Book 1 changes letter sizes while drawing. Wrap using those same widths so
// each resulting row can be placed from its own centre.
function wrapReactiveCanvasTextRows(text, maxWidth, midValue, trebleValue, spacing) {
  let rows = [];
  let currentRow = "";
  let outputLength = 0;
  let parts = text.split(/(\s+)/);

  function rowWidth(row) {
    return getReactiveLineWidth(row, midValue, trebleValue, spacing, outputLength);
  }

  function pushRow(row) {
    let trimmedRow = row.trimEnd();
    if (trimmedRow === "") return;
    rows.push(trimmedRow);
    outputLength += trimmedRow.length + 1;
  }

  for (let part of parts) {
    let candidate = currentRow + part;
    if (rowWidth(candidate) <= maxWidth) {
      currentRow = candidate;
      continue;
    }

    if (currentRow.trim() !== "") {
      pushRow(currentRow);
      currentRow = part.trimStart();
    }

    while (rowWidth(currentRow) > maxWidth && currentRow.length > 1) {
      let cutIndex = currentRow.length;
      while (cutIndex > 1 && rowWidth(currentRow.slice(0, cutIndex)) > maxWidth) cutIndex--;
      pushRow(currentRow.slice(0, cutIndex));
      currentRow = currentRow.slice(cutIndex);
    }
  }

  pushRow(currentRow);
  return rows.length > 0 ? rows : [text];
}

function exportFileName(extension) {
  let pageNumber = currentPageIndex + 1;
  return `moving-text-book-${activeBook}-page-${pageNumber}.${extension}`;
}

function downloadBlob(blob, fileName) {
  let link = document.createElement("a");
  let url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function binaryStringToBytes(binary) {
  let bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function buildCanvasPdf() {
  let jpegData = canvasElement.toDataURL("image/jpeg", 0.98);
  let imageBinary = atob(jpegData.split(",")[1]);
  let width = Math.round(canvasElement.width);
  let height = Math.round(canvasElement.height);
  let drawCommand = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ`;
  let objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBinary.length} >>\nstream\n${imageBinary}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Length ${drawCommand.length} >>\nstream\n${drawCommand}\nendstream\nendobj\n`
  ];
  let pdf = "%PDF-1.3\n";
  let offsets = [0];

  for (let object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }

  let xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([binaryStringToBytes(pdf)], { type: "application/pdf" });
}

function exportCanvasImage() {
  canvasElement.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, exportFileName("png"));
    }
  }, "image/png");
}

function exportCanvasPdf() {
  downloadBlob(buildCanvasPdf(), exportFileName("pdf"));
}

function getRecorderMimeType() {
  let types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ];
  return types.find(type => MediaRecorder.isTypeSupported(type)) || "";
}

async function toggleVideoRecording() {
  let recordButton = document.querySelector("#record-video");
  let recordStatus = document.querySelector("#record-status");

  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordButton.textContent = "record video";
    recordStatus.textContent = "saving video...";
    return;
  }

  if (!canvasElement.captureStream || typeof MediaRecorder === "undefined") {
    recordStatus.textContent = "video recording is not supported in this browser";
    return;
  }

  let stream = canvasElement.captureStream(30);
  try {
    recordingAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordingAudioStream.getAudioTracks().forEach(track => stream.addTrack(track));
  } catch (error) {
    recordingAudioStream = null;
    recordStatus.textContent = "recording video without microphone audio";
  }

  recordedChunks = [];
  let mimeType = getRecorderMimeType();
  let recorderOptions = { videoBitsPerSecond: VIDEO_BITS_PER_SECOND };
  if (mimeType) {
    recorderOptions.mimeType = mimeType;
  }
  mediaRecorder = new MediaRecorder(stream, recorderOptions);
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = () => {
    if (recordingAudioStream) {
      recordingAudioStream.getTracks().forEach(track => track.stop());
      recordingAudioStream = null;
    }
    stream.getTracks().forEach(track => track.stop());

    let blob = new Blob(recordedChunks, { type: "video/webm" });
    downloadBlob(blob, exportFileName("webm"));
    recordStatus.textContent = "video saved";
  };

  mediaRecorder.start();
  recordButton.textContent = "stop recording";
  recordStatus.textContent = "recording high resolution video...";
}

function setupExportButtons() {
  document.querySelector("#export-image").addEventListener("click", exportCanvasImage);
  document.querySelector("#export-pdf").addEventListener("click", exportCanvasPdf);
  document.querySelector("#record-video").addEventListener("click", toggleVideoRecording);
}

function getSafeTextStartY(blockHeight) {
  if (activeBook === "2") return 80;

  let topMargin = 80;
  let bottomMargin = 40;
  let maxStartY = Math.max(topMargin, height - bottomMargin - blockHeight);

  if (textPosition === "middle") {
    //constrain() clamps both ends, long text shifts up to stay fully visible
    return constrain((height - blockHeight) / 2, topMargin, maxStartY);
  }
  if (textPosition === "bottom") {
    return maxStartY;
  }
  return topMargin;
}

function getEstimatedTextBlockHeight(midValue, midStart, midEnd, trebleValue, spacing) {
  let totalHeight = 0;
  let centerFontSize = getCurrentMidSize(midValue, frameCount * 0.01);
  let centerCanvasFont = getCanvasFont(400, centerFontSize);
  let maxTextWidth = width - 100;

  for (let s = 0; s < savedLines.length; s++) {
    let originalText = lineText(savedLines[s]);
    let book4TargetPhrase = "who are you without your problems?";
    let isBook4TypedText = activeBook === "4" && originalText.trim() !== book4TargetPhrase;
    let drawRows = introActive || activeBook === "1"
      ? wrapReactiveCanvasTextRows(originalText, maxTextWidth, midValue, trebleValue, spacing)
      : isBook4TypedText
        ? wrapCanvasTextRows(originalText, centerCanvasFont, maxTextWidth, trebleValue, spacing)
        : [originalText];
    let rowCount = drawRows.join("\n").split("\n").length;
    let rowHeight = 40;
    let book1StairHeight = !introActive && activeBook === "2" ? (originalText.split(" ").length - 1) * 34 : 0;
    totalHeight += Math.max(0, (rowCount - 1) * rowHeight + book1StairHeight) + 40;
  }

  return totalHeight;
}

function updateTextPositionControls() {
  let allDisabled = activeBook === "2";
  let restrictToMiddle = viewMode === "digital" && !allDisabled; //digital view mode only allows "middle"

  document.querySelectorAll(".paper-align-button").forEach((button) => {
    let isMiddle = button.dataset.textPosition === "middle"; // get the button data from html
    button.disabled = allDisabled || (restrictToMiddle && !isMiddle); // disable top/bottom in digital view
  });
  document.querySelector(".paper-align-options").classList.toggle("is-disabled", allDisabled);
  //Force the "middle" and reflect it in the UI
  if (restrictToMiddle) {
    textPosition = "middle";
    document.querySelectorAll(".paper-align-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.textPosition === "middle");
    });
  }

}

function updateActiveFolderTilt() {
  document.querySelectorAll(".folder").forEach((folder) => {
    folder.classList.toggle("is-active-folder", !introActive && folder.dataset.book === activeBook);
  });
}

function setupPaperButtons() {
  setPaperColor(paperColor);
  setViewMode(viewMode, false);

  document.querySelectorAll(".paper-color-button").forEach((button) => {
    button.addEventListener("click", () => {
      setPaperColor(button.dataset.paperColor);
      document.querySelectorAll(".paper-color-button").forEach(item => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });

  document.querySelectorAll(".paper-align-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (activeBook === "2") return;
      textPosition = button.dataset.textPosition;
      document.querySelectorAll(".paper-align-button").forEach(item => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });

  document.querySelectorAll(".view-mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      setViewMode(button.dataset.viewMode);
      document.querySelectorAll(".view-mode-button").forEach(item => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
  updateTextPositionControls();
}

function setPaperColor(color) {
  paperColor = color;
  document.body.style.setProperty("--paper-color", paperColor);
}

function getPrintCanvasSize() {
  let allowedWidth = windowWidth * 0.6;
  let allowedHeight = windowHeight * 0.95;
  let aspect = 1 / 1.4142;
  let canvasWidth = allowedWidth;
  let canvasHeight = canvasWidth / aspect;

  if (canvasHeight > allowedHeight) {
    canvasHeight = allowedHeight;
    canvasWidth = canvasHeight * aspect;
  }

  return {
    width: canvasWidth,
    height: canvasHeight
  };
}

function getDigitalCanvasSize() {
  return {
    width: Math.max(300, windowWidth * 0.58),
    height: Math.max(480, windowHeight * 0.9)
  };
}

function getCurrentCanvasSize() {
  return viewMode === "digital" ? getDigitalCanvasSize() : getPrintCanvasSize();
}

function updateCanvasHolderSize(canvasSize) {
  let holder = document.querySelector("#canvas-holder");
  if (!holder) return;
  holder.style.width = `${canvasSize.width}px`;
}

function resizeSketchCanvas() {
  let canvasSize = getCurrentCanvasSize();
  resizeCanvas(canvasSize.width, canvasSize.height);
  updateCanvasHolderSize(canvasSize);
  updateTextSizeRange();
}

function updateTextSizeRange() {
  if (viewMode === "digital") {
    targetMin = constrain(width * 0.035, 32, 60);
    targetMax = constrain(width * 0.13, 100, 220);
  } else {
    targetMin = PRINT_TARGET_MIN;
    targetMax = PRINT_TARGET_MAX;
  }
}

function setViewMode(mode, shouldResize = true) {
  viewMode = mode;
  updateTextSizeRange();
  document.body.classList.toggle("digital-view", viewMode === "digital");
  document.body.classList.toggle("print-view", viewMode === "print");
  updateTextPositionControls(); //reapply the middle-only restriction whenver view mod changes
  if (shouldResize && canvasElement) {
    resizeSketchCanvas();
  }
}

function saveBookData(bookId, pages) {
  localStorage.setItem("myCanvasText_" + bookId, JSON.stringify(pages));
  if (!isLocalPage) return;
  fetch(apiBase + "/api/books/" + encodeURIComponent(bookId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pages })
  }).catch(() => {
    console.log("Database server is not running, saved in this browser only.");
  });
}

async function loadBookData(bookId) {
  if (!isLocalPage) return;
  try {
    let response = await fetch(apiBase + "/api/books/" + encodeURIComponent(bookId));
    if (!response.ok) return;
    let data = await response.json();
    if (bookId !== activeBook) return;

    allPages = normalizePages(data.pages);
    ensurePageStarter();
    savedLines = allPages[currentPageIndex] || [];
    localStorage.setItem("myCanvasText_" + bookId, JSON.stringify(allPages));

    if (lockedLayer && myInput) {
      showSavedLines();
      myInput.innerText = isCurrentPageFull() ? "" : currentPageDraft();
      updatePageFullState();
      focusTextInput();
    }
  } catch (error) {
    console.log("Database server is not running, loaded from this browser only.");
  }
}


if (storedData) {
  let parsed = JSON.parse(storedData);
  allPages = normalizePages(parsed);
} else {
  allPages = [[]]; 
}
savedLines = introActive ? INTRO_LINES : allPages[currentPageIndex];

function preload() {
  // 🎯 Forces p5 to fully download and register the variable font before setup() runs
  baseFont = loadFont('assets/fonts/Roboto-VariableFont_wdth\,wght.ttf');
}

function setup() {
  //SET UP CANVAS
  let canvasSize = getCurrentCanvasSize();
  pixelDensity(CANVAS_PIXEL_DENSITY);
  let cnv = createCanvas(canvasSize.width, canvasSize.height);
  canvasElement = cnv.elt;
  cnv.parent("canvas-holder");
  updateCanvasHolderSize(canvasSize);
  setupExportButtons();
  setupPaperButtons();
  //PAGE BUTTONS + SAVE CONTENT FOR EACH PAGE
  let prevBtn = select('#prev-page');
  let nextBtn = select('#next-page');
  let pageIndicator = select("#page-indicator");
  if (introActive) {
    prevBtn.elt.disabled = true;
    nextBtn.elt.disabled = true;
  }
  function updatePageDisplay() {
    ensurePageStarter();
    savedLines = (allPages[currentPageIndex] || []).slice(0, PAGE_LINE_LIMIT); 
    allPages[currentPageIndex] = savedLines;
    
    // All historical lines go straight into the uneditable locked visual layer
    showSavedLines();
    myInput.innerText = isCurrentPageFull() ? "" : currentPageDraft();
    updatePageFullState();
    
    pageIndicator.html("Page " + (currentPageIndex + 1)); 
    focusTextInput();
  }
  
  nextBtn.mousePressed(() => {
    stashCurrentDraft();
    currentPageIndex++;

    if(!allPages[currentPageIndex]) {
      allPages[currentPageIndex] = [];
    }
    updatePageDisplay();
  });

  prevBtn.mousePressed(() => {
    if (currentPageIndex > 0) {
      stashCurrentDraft();
      currentPageIndex--;
      
      updatePageDisplay();
    }
  });

  
  //TEXT INPUT
  myInput = document.querySelector("#editable-text-layer");
  lockedLayer = document.querySelector("#locked-text-layer")
  writingPlaceholder = myInput.dataset.placeholder;
  if (introActive) {
    myInput.dataset.placeholder = "pick a folder and start writing together";
  }
  let textInputBox = document.querySelector(".TextInput");
  textInputBox.addEventListener("click", (event) => {
    if (event.target !== myInput) {
      focusTextInput();
    }
  });

    //MAKE IT STUTTER (FOLDER 2)
    myInput.addEventListener("input",(e) =>{
      if (activeBook !== "2") return; //if the active book is not data book 2 then stop the function (return)
      if(e.inputType !== "insertText") return //safety guard: only works when typing
      let typedChar = e.data;
      if (!typedChar) return;
      const consonants = ['t', 's', 'c', 'r', 'p', 'b', 'f', 'k', 'j', 'g', 'd', 'x','T', 'S', 'C', 'R', 'P', 'B', 'F', 'K', 'J', 'G', 'D', 'X'];
      if (consonants.includes(typedChar)) {
        let repeatCount = Math.floor(random(1,5));
        let stutterString = typedChar.repeat(repeatCount -1);

        let selection = window.getSelection();
        if(selection.rangeCount > 0) {
          let range = selection.getRangeAt(0);
          let stutterNode = document.createTextNode(stutterString);

          range.insertNode(stutterNode);

          range.setStartAfter(stutterNode);
          range.setEndAfter(stutterNode);
          selection.removeAllRanges();
          selection.addRange(range);
        
        }
      }
    })

    //A DAY WITHOUT A (FOLDER 1)
    myInput.addEventListener("input", (e) => {
      if (activeBook !== "1") return;
      if (e.inputType !== "insertText") return;
      let typedChar = e.data;
      if (!typedChar) return;
      if (typedChar ==='a' || typedChar === 'A') {
        const alternativeVowels = ['i','u','o', 'e'];
        let randomVowel = random(alternativeVowels);

        if (typedChar === 'I') {
          randomVowel = randomVowel.toUpperCase();
        }
         let selection = window.getSelection();
         if (selection.rangeCount > 0) {
          let range = selection.getRangeAt(0);
          range.setStart(range.startContainer, range.startOffset - 1);
          range.deleteContents();
          let replacementNode = document.createTextNode(randomVowel);
          range.insertNode(replacementNode);

          range.setStartAfter(replacementNode);
          range.setEndAfter(replacementNode);
          selection.removeAllRanges();
          selection.addRange(range);
         }
      }
    })

    //DREAM LOOP (FOLDER 3)
    let loopSwitch = false; //toggle switch to use either the 1. phrase or 2. one
    myInput.addEventListener("input", (e) => { //listen to the action happens in the input box
      if (activeBook !== "3") return; //only applied to folder 3
      if (e.inputType !== "insertParagraph") return;
      
      let currentText = myInput.innerText;
      let lines = currentText.split('\n'); //if there is a line break, breaks it into an array of lines
      
      //FILTER OUT UNWANTED EMPTY LINES
      let nonArr = lines.filter(line => line.trim() !== ""); //filter out the empty lines added by the browser
      let userLinesOnly = nonArr.filter(line => {
        let clean = line.trim();
        return clean !== "but then, i woke up" && clean !== "then i woke up again"; //?
      });

      //ADD PHRASE AFTER EACH § LINES
        //Trigger Condition
        // (>0)check if the box isn't empty
        // (% 3 === 0) Modulo checks for remainder: after every 3 lines the remainder is 0
        //(lines[lines.length - 1] === "") let JS when the Enter is pressed
      if (userLinesOnly.length > 0 && userLinesOnly.length % 3 === 0 && lines[lines.length - 1] === "") {
        
        //loopSwitch ? ... : ... (a shorthand if/else): if loopSwitch is true, targetPhrase becomes the 1. phrase, or else it becomes the 2.
        let targetPhrase = loopSwitch ? "but then, i woke up" : "then i woke up again";
        let lastLine = userLinesOnly[userLinesOnly.length - 1].trim();
        // check the last line, if not the dream loop phrase then add the phrase
        if (!lastLine.endsWith("but then, i woke up") && !lastLine.endsWith("then i woke up again")) {
          //how the phrase appears, no unwanted spaces, after a line break then move to new line
          myInput.innerText = currentText.trimEnd() + "\n" + targetPhrase + "\n\n";
          loopSwitch = !loopSwitch; //flip the toggle
          focusTextInput();
        }
      }
    });
    //WITHOUT PROBLEMS (FOLDER 4)
    let problemSwitch = false; //toggle switch to use either the 1. phrase or 2. one
    myInput.addEventListener("input", (e) => { //listen to the action happens in the input box
      if (activeBook !== "4") return; //only applied to folder 3
      if (e.inputType !== "insertParagraph") return;
      
      let currentText = myInput.innerText;
      let lines = currentText.split('\n'); //if there is a line break, breaks it into an array of lines
      
      //FILTER OUT UNWANTED EMPTY LINES
      let nonArr = lines.filter(line => line.trim() !== ""); //filter out the empty lines added by the browser
      let userLinesOnly = nonArr.filter(line => {
        let clean = line.trim();
        return clean !== "who are you without your problems?"; //?
      });

      //ADD PHRASE AFTER EACH 3 LINES
        //Trigger Condition
        // (>0)check if the box isn't empty
        // (% 3 === 0) Modulo checks for remainder: after every 3 lines the remainder is 0
        //(lines[lines.length - 1] === "") let JS know when the Enter is pressed
      if (userLinesOnly.length > 0 && userLinesOnly.length % 1 === 0 && lines[lines.length - 1] === "") {
        
        //loopSwitch ? ... : ... (a shorthand if/else): if loopSwitch is true, targetPhrase becomes the 1. phrase, or else it becomes the 2.
        let targetPhrase = "who are you without your problems?" ;
        let lastLine = userLinesOnly[userLinesOnly.length - 1].trim();
        // check the last line, if not the dream loop phrase then add the phrase
        if (!lastLine.endsWith("who are you without your problems?")) {
          //how the phrase appears, no unwanted spaces, after a line break then move to new line
          myInput.innerText = currentText.trimEnd() + "\n" + targetPhrase + "\n\n";
          problemSwitch = !problemSwitch; //flip the toggle
          focusTextInput();
        }
      }
    });
    //ALL IS ALL (FOLDER 5)
    myInput.addEventListener("input", (e) => {
      if (activeBook !== "5") return;
      if (e.inputType !== "insertParagraph") return;

      let currentText = myInput.innerText;

      // If Enter was pressed, start the new line with "All is "
      myInput.innerText = currentText.trimEnd() + "\n" + BOOK5_LINE_PREFIX;

      focusTextInput();
    });
    if (activeBook === "5" && myInput.innerText.trim() === "") {
      myInput.innerText = BOOK5_LINE_PREFIX;
      focusTextInput();
    }

    myInput.addEventListener("input", limitDraftToPage);
    myInput.addEventListener("input", ensureAllIsPrefix);

    //SAVE LINES BUTTON
    // INITIALIZE TEXT LAYERS ON BOOT
    if (savedLines.length > 0) { 
      showSavedLines();
      myInput.innerText = "";
    } else { 
      savedLines = [];
      lockedLayer.innerText = "";
      myInput.innerText = "";
    }
    updatePageFullState();
    let saveButton = document.querySelector("#save-line");
    if (introActive) {
      myInput.contentEditable = "false";
      saveButton.disabled = true;
    }
    saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!commitTypedLines()) return; // Nothing new typed, skip
      savedLines = allPages[currentPageIndex] || [];
      delete pageDrafts[currentDraftKey()];
      
      // Save to local storage
      saveBookData(activeBook, allPages);
      console.log("Lines locked and saved!");
  
      updatePageDisplay();
      if (!isCurrentPageFull()) focusTextInput();
    });

  //OPEN FOLDER FUNCTION
  //select all class .folder in html
  let folders = selectAll(".folder");
  //run loop in all .folder class
  for(let f = 0 ; f< folders.length; f++) {
    //add interaction function to folder
    folders[f].mousePressed(function() {
      //let activeBook reach to the code data-book in html
      introActive = false;
      document.body.classList.remove("intro-active");
      myInput.dataset.placeholder = writingPlaceholder;
      prevBtn.elt.disabled = false;
      nextBtn.elt.disabled = false;
      stashCurrentDraft();
      activeBook = this.attribute("data-book");
      updateActiveFolderTilt();
      loopSwitch = false;
      lastJudgeVisualLineCount = 0;
      judgeLineTarget = Math.floor(random(1, 4));
      updateTextPositionControls();

      let sliderControl = select("#slider-control");
      if (sliderControl) {
        sliderControl.style("display", "block");
      }
      // Reset input box view
      myInput.innerHTML = "";
      myInput.innerText = "";
      currentPageIndex = 0;
      //grab the stored text in each data-book and put it into the text-input
      let folderData = localStorage.getItem("myCanvasText_" + activeBook);
      currentPageIndex = 0;
      if (folderData) {
        let parsed = JSON.parse(folderData);
        allPages = normalizePages(parsed);
        ensurePageStarter();
        savedLines = allPages[currentPageIndex]; 
        
        // Populate locked layer, leave typing layer clear
        showSavedLines();
        myInput.innerText = "";
      } else {
        allPages = defaultPagesForBook(activeBook);
        ensurePageStarter();
        savedLines = allPages[currentPageIndex];
        lockedLayer.innerText = "";
        myInput.innerText = "";
      }
      if (!isCurrentPageFull()) myInput.innerText = currentPageDraft();
      updatePageFullState();
      loadBookData(activeBook);
      pageIndicator.html("Page 1")
      focusTextInput();
      console.log("Switched to Folder " + activeBook);
    }
  )
  }
  document.querySelector("#slider-control").style.display = "block";
  updateActiveFolderTilt();
  if (!introActive) {
    loadBookData(activeBook);
    requestAnimationFrame(focusTextInput);
  }

  //UPLOAD FONT
  let fontUploader = document.querySelector("#font-uploader");
  fontUploader.addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        // Create a dynamic font-face style element to inject into the web page
        let newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
          @font-face {
            font-family: 'CustomUploadedFont';
            src: url('${e.target.result}');
            font-weight: 100 900;
          }
        `));
        let oldStyle = document.getElementById("uploaded-variable-font-style");
        if(oldStyle) oldStyle.remove();
        document.head.appendChild(newStyle);
        
        // Signal to p5 to look for this font family string name instead
        customFont = loadFont(e.target.result, () => {
        console.log("Custom variable font loaded and configured successfully!");
        });
      };
      reader.readAsDataURL(file);
    }
  });


  elavateStartSlider = document.querySelector("#elavate-start")
  elavateEndSlider = document.querySelector("#elavate-end")
  opaStartSlider = document.querySelector("#opa-start")
  opaEndSlider = document.querySelector("#opa-end")
  sizeStartSlider = document.querySelector("#size-start")
  sizeEndSlider = document.querySelector("#size-end")
  variableStartSlider = document.querySelector("#variable-start") 
  variableEndSlider = document.querySelector("#variable-end") 
  highStartSlider = document.querySelector("#high-start")
  highEndSlider = document.querySelector("#high-end")
  rotateStartSlider = document.querySelector("#rotate-start")
  rotateEndSlider = document.querySelector("#rotate-end")
  spacingStartSlider = document.querySelector("#spacing-start")
  spacingEndSlider = document.querySelector("#spacing-end")

  
  elavateSwitch = document.querySelector("#elavate-switch");
  opacitySwitch = document.querySelector("#opacity-switch");
  sizeSwitch = document.querySelector("#size-switch");
  weightSwitch = document.querySelector("#weight-switch");
  highSwitch = document.querySelector("#high-switch");
  rotateSwitch = document.querySelector("#rotate-switch");
  spacingSwitch = document.querySelector("#spacing-switch");

  function updateGroupState(groupSelector, groupSwitch) {
    let group = document.querySelector(groupSelector);
    group.classList.toggle("is-off", !groupSwitch.checked);
    group.querySelectorAll("input").forEach((input) => {
      if (input !== groupSwitch) {
        input.disabled = !groupSwitch.checked;
      }
    });
  }
  lowGroupSwitch = document.querySelector("#low-group-switch");
  midGroupSwitch = document.querySelector("#mid-group-switch");
  trebleGroupSwitch = document.querySelector("#treble-group-switch");
 
  lowGroupSwitch.addEventListener("change", () => {
    updateGroupState(".low-value", lowGroupSwitch);
  });
  midGroupSwitch.addEventListener("change", () => {
    updateGroupState(".mid-value", midGroupSwitch);
  });
  trebleGroupSwitch.addEventListener("change", () => {
    updateGroupState(".treble-value", trebleGroupSwitch);
  });
 
  // Sync initial state on load in case any group switch starts unchecked
  updateGroupState(".low-value", lowGroupSwitch);
  updateGroupState(".mid-value", midGroupSwitch);
  updateGroupState(".treble-value", trebleGroupSwitch);
 




  weightSwitch.addEventListener("change", () => {
    if (weightSwitch.checked) {
      opacitySwitch.checked = false;
    } else if (!opacitySwitch.checked) {
      opacitySwitch.checked = true;
    }
  });

  opacitySwitch.addEventListener("change", () => {
    if (opacitySwitch.checked) {
      weightSwitch.checked = false;
    } else if (!elavateSwitch.checked) {
      weightSwitch.checked = true;
    }
  });

  rotateSwitch.addEventListener("change", () => {
    if (rotateSwitch.checked) {
      spacingSwitch.checked = false;
    } else if (!spacingSwitch.checked) {
      spacingSwitch.checked = true;
    }
  });

  spacingSwitch.addEventListener("change", () => {
    if (spacingSwitch.checked) {
      rotateSwitch.checked = false;
    } else if (!rotateSwitch.checked) {
      rotateSwitch.checked = true;
    }
  });

  //Switch size and weight
  // 🔄 FULLY ALIGNED INTERLOCK REACTION SWITCHES
  // Sync the true canvas engine state dynamically to match your HTML's default checks on boot
  switchSizeWeight = elavateSwitch.checked; 

  sizeSwitch.addEventListener("change", () => {
    if (sizeSwitch.checked) {
      elavateSwitch.checked = false;
      switchSizeWeight = false;
    } else {
      // Safety rail: If user unchecks size, turn weight back on so audio isn't lost
      elavateSwitch.checked = true;
      switchSizeWeight = true;
    }
  });
  
  elavateSwitch.addEventListener("change", () => {
    if (elavateSwitch.checked) {
      sizeSwitch.checked = false;
      switchSizeWeight = true;
    } else {
      // Safety rail: If user unchecks weight, turn size back on so audio isn't lost
      sizeSwitch.checked = true;
      switchSizeWeight = false;
    }
  });
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  frameRate(20);
  angleMode(DEGREES);
}
//SIZE CHANGE FEATURE
function getCurrentMidSize(midValue, timeSize) {
  let midSize = targetMin;

  if (midValue > 0 && sizeSwitch.checked) {
    let noiseSize = noise(timeSize);

    if (midValue <= 150) {
      midSize = dynamicSize * map(noiseSize, 0, 1, 0.5, 2);
    } else {
      midSize = dynamicSize * map(noiseSize, 0, 1, 2.5, 5);
    }

    midSize = constrain(midSize, targetMin, targetMax);
  } else if (elavateSwitch.checked && !sizeSwitch.checked) {
    midSize = targetMin;
  }

  return midSize;
}


  //FLOATING FEATURE
function getCurrentElavate(midValue, timeY) {
  if (midValue <= 0 || !elavateSwitch.checked) return 0 ;
    let noiseY = noise(timeY) ;
    let liftPower = constrain(map(midValue, 0 ,255, 0, 2), 0, 2);
    let elavateY;
    if (midValue <= 100) {
      elavateY = liftPower * map(noiseY, 0, 1, -60, 60);
    } else {
      elavateY = liftPower * map(noiseY, 0, 1, -130, 130);
    }
    return elavateY;
  }


//FONT_WEIGHT FEATURE
function getCurrentWeight(lowValue, timeSize) {
  let lowWeight = 400;
  if (lowValue > 0 && weightSwitch.checked) {
    let noiseWeight = noise(timeSize);
    if (lowValue <= 180) {
      lowWeight = map(noiseWeight, 0, 1, 0.2, 2) * dynamicWeight;
    } else {
      lowWeight = map(noiseWeight, 0, 1, 2, 5) * dynamicWeight;
    }
    lowWeight = constrain( lowWeight, weightMin, weightMax);
  }
  return Math.round(lowWeight);
}
//BLUR EFFECT
function getCurrentBlur(lowValue, timeY) {

  let letterBlur = 0;
        if (lowValue > 0 && opacitySwitch.checked) {
          let noiseBlur = noise(timeY);
          let blurAmount
          if (lowValue <= 150) {
            blurAmount = map(noiseBlur, 0, 1, 1, 20) * dynamicBlur  ;
          } else {
            blurAmount = map(noiseBlur, 0, 1, 15, 30) * dynamicBlur;
          }
        
          letterBlur = Math.round(constrain(blurAmount, 0 ,30));
        }
        return letterBlur;
}

function getReactiveLineWidth(text, midValue, trebleValue, spacing, startCharacterIndex = 0) {
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    let characterIndex = startCharacterIndex + i;
    let timeSize = (frameCount * 0.02) + characterIndex;
    let midSize = getCurrentMidSize(midValue, timeSize);
    let finalWeight = getCurrentWeight(lowValue, timeSize);
    drawingContext.font = getCanvasFont(finalWeight, midSize);
    totalWidth += drawingContext.measureText(text[i]).width;
    if (i < text.length - 1) {
      totalWidth += getLetterSpacing(characterIndex, trebleValue, spacing);
    }
  }
  return totalWidth;
}
let uploadedWeightMin = 300;
let uploadedWeightMax = 900;
function setUploadedFontWeightRange (font) {
  let axes = font.tables?.fvar?.axes || [];
  let weightAxis = axes.find(axis => axis.tag === "wght");
  if (weigthAxis) {
    uploadedWeigthMin = weigthAxis.minValue;
    uploadedWeightMax = weightAxis.maxValue;
  } else {
    uploadedWeightMin = 300;
    uploadedWeightMax = 900;
  }
}

function draw() {
  background(paperColor);
//get audio values using p5.fft
  fft.analyze();

  lowValue = fft.getEnergy (20, 250);
  midValue = fft.getEnergy(250, 4000);
  trebleValue = fft.getEnergy(4000, 14000);



  if ((!weightSwitch.checked && !opacitySwitch.checked) || !lowGroupSwitch.checked){ lowValue = 0; };
  if ((!rotateSwitch.checked && !spacingSwitch.checked) || !trebleGroupSwitch.checked){ trebleValue = 0; };


  let variableStart = Number(variableStartSlider.value);
  let variableEnd = Number(variableEndSlider.value);
  let elavateStart = Number(elavateStartSlider.value);
  let elavateEnd = Number(elavateEndSlider.value);
  let opaStart = Number(opaStartSlider.value);
  let opaEnd = Number(opaEndSlider.value);
  let rotateStart = Number(rotateStartSlider.value);
  let rotateEnd = Number(rotateEndSlider.value);
  let spacingStart = Number(spacingStartSlider.value);
  let spacingEnd = Number(spacingEndSlider.value)
  let midStart, midEnd;
  if (switchSizeWeight) {
    midStart = Number(elavateStartSlider.value);
    midEnd = Number(elavateEndSlider.value);
    if (!elavateSwitch.checked || !midGroupSwitch.checked) midValue = 0;
  } else {
    midStart = Number(sizeStartSlider.value);
    midEnd = Number(sizeEndSlider.value);
    if (!sizeSwitch.checked || !midGroupSwitch.checked) midValue = 0;
  }
  //range for the size and position based on the sound frequencies from 0 to 255
  dynamicSize = map(midValue, midStart, midEnd, targetMin, targetMax);
  dynamicSize = constrain(dynamicSize, targetMin, targetMax)

  
  dynamicWeight = map(lowValue, variableStart, variableEnd, uploadedWeightMin, uploadedWeightMax)
  dynamicWeight = constrain(dynamicWeight, uploadedWeightMin, uploadedWeightMax)
  dynamicBlur = map (lowValue, opaStart, opaEnd, 0, 1);
  // Match the distance slider's range-dependent response. Moving the selected
  // range toward the end therefore produces a more dramatic wind movement.
  let wiggle = rotateStart === rotateEnd
    ? (trebleValue >= rotateEnd ? 3 : 1)
    : map(trebleValue, rotateStart, rotateEnd, 1, 3);
  let spacing = map (trebleValue, spacingStart, spacingEnd, 1,3);
  textY = getSafeTextStartY(getEstimatedTextBlockHeight(midValue, midStart, midEnd, trebleValue, spacing));
  
  // Apply uploaded font if it exists
  

  //SOUND REACT FEATURES
  let lineOffset = 0; //to adjust text width
  let dreamLoopAwaitingRandomX = false //tracks the next line if it should jump to a random a
  let dreamLoopParagraphX = null; //makes the whole paragraph share one x, instead of resetting after one line
  for (let s = 0; s < savedLines.length; s++) {
    let originalText = lineText(savedLines[s]);
    let book4TargetPhrase = "who are you without your problems?";
    let isBook4TargetPhrase = activeBook === "4" && originalText.trim() === book4TargetPhrase;
    let isBook4TypedText = activeBook === "4" && !isBook4TargetPhrase;
    let centerFontSize = getCurrentMidSize(midValue, frameCount * 0.01);
    let centerFontWeight = 400;
    let centerCanvasFont = getCanvasFont(centerFontWeight, centerFontSize);
    let centerText = introActive || activeBook === "1" || activeBook === "5" || isBook4TargetPhrase;
    let reactiveAlignmentText = introActive || activeBook === "1" || activeBook === "5" || activeBook === "4";
    let book4TypedRight = isBook4TypedText && useRightAlignmentForLine(originalText, s);
    let maxTextWidth = width - 100;
    let drawRows = introActive || activeBook === "1"
      ? wrapReactiveCanvasTextRows(originalText, maxTextWidth, midValue, trebleValue, spacing)
      : isBook4TypedText
        ? wrapCanvasTextRows(originalText, centerCanvasFont, maxTextWidth, trebleValue, spacing)
        : [originalText];
    let currentText = drawRows.join("\n");
    let rowStartIndices = [];
    let rowStartIndex = 0;
    for (let row of drawRows) {
      rowStartIndices.push(rowStartIndex);
      rowStartIndex += row.length + 1;
    }
    let rowIndex = 0;
    let rowLetterIndex = 0;
    //DREAM LOOP TEXT FORM
    let trimmedOriginal = originalText.trim();
    let isDreamLoopTargetPhrase = activeBook === "3" &&
      (trimmedOriginal === "but then, i woke up" || trimmedOriginal === "then i woke up again" );
      if (activeBook == "3" && dreamLoopAwaitingRandomX && trimmedOriginal !== "") {
        let rawNoise = noise(s * 12.34 + 999);
        let stretched = constrain(0.5 + (rawNoise - 0.5) * 3, 0, 1);
        let paragraphMaxWidth = 0;
        for (let k = s; k < savedLines.length; k++) {
          let candidate = lineText(savedLines[k]).trim();
          if (k > s && candidate !== "" &&
              (candidate === "but then, i woke up" || candidate === "then i woke up again")) break;
          if (candidate === "") continue;
          let candidateWidth = getCenteredLineWidth(lineText(savedLines[k]), centerCanvasFont, trebleValue, spacing);
          paragraphMaxWidth = Math.max(paragraphMaxWidth, candidateWidth);
        }
        let safetyBuffer = 30; // extra room for per-letter size noise pushing slightly past the estimate
        let genericMaxStartX = Math.max(50, width - paragraphMaxWidth - safetyBuffer - 50);
        dreamLoopParagraphX = map(stretched, 0, 1, 50, genericMaxStartX);
        dreamLoopAwaitingRandomX = false; 


      }
      if (isDreamLoopTargetPhrase) {
        dreamLoopAwaitingRandomX = true;
      }


    function getRowStartX(index) {
      let rowText = drawRows[index] || "";
      let rowWidth = reactiveAlignmentText
        ? getReactiveLineWidth(rowText, midValue, trebleValue, spacing, rowStartIndices[index] || 0)
        : getCenteredLineWidth(rowText, centerCanvasFont, trebleValue, spacing);
      if (centerText) return (width - rowWidth) / 2;
      if (book4TypedRight) return width - rowWidth - 50;
      if (activeBook === "3" && dreamLoopParagraphX !== null) {
        // Jump to a randomx, clamped so the full line stay insdie the canvas
        let maxStartX = Math.max(50, width - rowWidth - 50);
        return Math.min(dreamLoopParagraphX, maxStartX)
      }
      return 50;
    }
    let cursorX = getRowStartX(rowIndex);
    let baseRowStartX = cursorX;
    let stairOffset = 0;
    let stairStep = 34;

    //loop goes into the text to find each letter
    for (let i = 0; i < currentText.length; i++) {
      let timeY = (frameCount * 0.03) + i;
      let timeX = (frameCount * 0.01) + i;
      let timeAngle = (frameCount * 0.03) + i;
      let timeSize = (frameCount * 0.02) + i;
      let letter = currentText[i] //define each letter
      let midSize = getCurrentMidSize(midValue, timeSize);
      let elavateY = getCurrentElavate(midValue, timeY);
      let letterBlur = getCurrentBlur(lowValue, timeY)
      if (letter === '\n'){
        rowIndex++;
        rowLetterIndex = 0;
        cursorX = getRowStartX(rowIndex);
        lineOffset += 40; //line spacing scales with font size
        continue;
      }
      let finalWeight = getCurrentWeight(lowValue, timeSize);
      let canvasFont = getCanvasFont(finalWeight, midSize);
      drawingContext.font = canvasFont;
      let currentLetterWidth = drawingContext.measureText(letter).width;
      let rightBoundary = width - (midSize * 1.2) - 40;
      if (!isBook4TypedText && !introActive && activeBook !== "1" && cursorX + currentLetterWidth > rightBoundary) {
        cursorX = baseRowStartX;
        lineOffset += 40;
      }
      let targetY = textY + elavateY + lineOffset + stairOffset; //apply lowY + stairOffset


      
      // let letterOpacity = map(letterBlur, 0, 14, 1, 0.1);
      // letterOpacity = constrain(letterOpacity, 0.1, 1);


      let bottomBoundary = height - 40;
      if (targetY > bottomBoundary) {
        break;
      }

      //condition for rotate
      let angle = 0;
      if (trebleValue > 0 && rotateSwitch.checked) {
        let noiseAngle = noise(timeAngle);
        // let maxRotate = lowValue <= 50 ? 90 : 0;
        // angle = map(noiseAngle, 0, 1, -maxRotate, maxRotate) * wiggle;
        // Keep rotation continuous as the sound level changes.
        angle = map(noiseAngle, 0, 1, -90, 90) * wiggle;
      }
      let spacingIndex = isBook4TypedText ? rowLetterIndex : i;
      let extraSpacing = getLetterSpacing(spacingIndex, trebleValue, spacing);

      push();
      translate(cursorX, targetY);
      rotate(angle);
      // Put the numeric weight directly in the canvas font shorthand.
      // Canvas ignores fontVariationSettings here, so omitting the weight
      // makes the browser render the variable font at normal 400 every frame.
      drawingContext.font = canvasFont;
      drawingContext.shadowBlur = letterBlur;
      drawingContext.shadowColor = letterBlur > 0 ? "rgb(0, 0, 0)" : "transparent";
      drawingContext.fillStyle = `rgba(0, 0, 0, 1)`;
      drawingContext.fillText(letter, 0, 0);
      drawingContext.shadowBlur = letterBlur;
      drawingContext.shadowColor = "black";
      drawingContext.shadowOffsetX = 0;
      drawingContext.shadowOffsetY = 0;
      drawingContext.textAlign = 'left';
      drawingContext.textBaseline = 'alphabetic';
     
      // 4. Draw the character using the native canvas renderer
      drawingContext.fillText(letter, 0, 0);

      pop(); // Closes your character matrix translation nodesafely

      // 5. Track the carriage position relative to the customized character thickness
      cursorX += drawingContext.measureText(letter).width + extraSpacing;
      rowLetterIndex++;
      //feature for book 2
      if (activeBook === "2" && letter === " ") {
        stairOffset += stairStep;
      }
      if (!isBook4TypedText && !introActive && activeBook !== "1" && cursorX > width - 50) { 
        cursorX = baseRowStartX;         // Typewriter carriage return back to the left wall
        lineOffset += 40;     // Drop down 60 pixels for the next line of text
  }
  }
  lineOffset += 40; 
  }
  
  
  
}

function windowResized() {
  resizeSketchCanvas();
}
