// Exam lifecycle (select / start / retake / finish), the practice-mode modal,
// and the manual save-report actions.

import { BASE } from "./constants.js";
import { state, els } from "./state.js";
import { fetchText, showFetchError } from "./utils.js";
import { parseExam, parseAnswerKey } from "./parse.js";
import { titleForId } from "./catalog.js";
import { clearExamTimer, startTimer } from "./timer.js";
import { autoSaveResult, deleteSavedResult } from "./storage.js";
import { buildResultMarkdown } from "./result-md.js";
import { render } from "./render.js";

// ---------- Exam lifecycle ----------

export function selectExam(id) {
  var title = titleForId(id);
  fetchText(BASE + id + "/result.md")
    .then(function (md) {
      clearExamTimer();
      state.examId = id;
      state.examTitle = title;
      state.savedResultMd = md;
      state.view = "saved-result";
      els.search.value = title;
      render();
    })
    .catch(function () { showModeModal(id, title); });
}

export function startFreshExam(id, title, mode) {
  fetchText(BASE + id + "/exam.md")
    .then(function (md) {
      var parsed = parseExam(md);
      state.examId = id;
      state.examTitle = title || parsed.title || ("Exam " + id);
      state.questions = parsed.questions;
      state.answers = {};
      state.flags = {};
      state.key = null;
      state.finished = false;
      state.savedResultMd = null;
      state.mode = mode || "timed";
      state.view = "exam";
      state.current = 0;
      els.search.value = state.examTitle;
      if (state.mode === "timed") {
        startTimer(parsed.questions.length);
        render();
      } else {
        clearExamTimer();
        fetchText(BASE + id + "/answer-key.md")
          .then(function (keyMd) { state.key = parseAnswerKey(keyMd); render(); })
          .catch(function () { render(); });
      }
    })
    .catch(showFetchError);
}

export function retakeExam() {
  var id = state.examId, title = state.examTitle;
  deleteSavedResult(id).then(function () { showModeModal(id, title); });
}

// ---------- Mode selection modal ----------

var modeModalEl = null;
var modeStartBtn = null;
var modeCancelBtn = null;
var pendingExam = null;

function updateModeOptionStyles() {
  modeModalEl.querySelectorAll(".mode-option").forEach(function (opt) {
    var input = opt.querySelector("input");
    opt.classList.toggle("selected", input.checked);
  });
}

function showModeModal(id, title) {
  pendingExam = { id: id, title: title };
  modeModalEl.querySelector('input[value="review"]').checked = true;
  updateModeOptionStyles();
  modeModalEl.hidden = false;
}

function closeModeModal() { modeModalEl.hidden = true; pendingExam = null; }

// Grab modal refs and wire its controls. Called once from main.
export function initModeModal() {
  modeModalEl = document.getElementById("modeModal");
  modeStartBtn = document.getElementById("modeStartBtn");
  modeCancelBtn = document.getElementById("modeCancelBtn");

  modeModalEl.querySelectorAll('input[name="practiceMode"]').forEach(function (input) {
    input.addEventListener("change", updateModeOptionStyles);
  });
  if (modeStartBtn) {
    modeStartBtn.addEventListener("click", function () {
      if (!pendingExam) return;
      var mode = modeModalEl.querySelector('input[name="practiceMode"]:checked').value;
      var exam = pendingExam;
      closeModeModal();
      startFreshExam(exam.id, exam.title, mode);
    });
  }
  if (modeCancelBtn) modeCancelBtn.addEventListener("click", closeModeModal);
  modeModalEl.addEventListener("click", function (e) { if (e.target === modeModalEl) closeModeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modeModalEl.hidden) closeModeModal(); });
}

// ---------- Finish / scoring trigger ----------

export function finishExam(auto) {
  clearExamTimer();
  var unanswered = state.questions.filter(function (q) { return !state.answers[q.num]; }).length;
  if (auto !== true && unanswered > 0) {
    var ok = window.confirm(unanswered + " question(s) are unanswered and will be scored as incorrect. Finish anyway?");
    if (!ok) return;
  }
  if (state.key) {
    state.finished = true;
    state.view = "results";
    render();
    window.scrollTo(0, 0);
    autoSaveResult();
    return;
  }
  fetchText(BASE + state.examId + "/answer-key.md")
    .then(function (md) {
      state.key = parseAnswerKey(md);
      state.finished = true;
      state.view = "results";
      render();
      window.scrollTo(0, 0);
      autoSaveResult();
    })
    .catch(showFetchError);
}

// ---------- Save actions ----------

function flashStatus(msg) {
  var el = document.getElementById("saveStatus");
  if (!el) return;
  el.textContent = msg;
  setTimeout(function () { if (el.textContent === msg) el.textContent = ""; }, 3000);
}

export function copyResult() {
  var md = buildResultMarkdown();
  function fallback() {
    var ta = document.getElementById("reportText");
    if (ta) { ta.focus(); ta.select(); try { document.execCommand("copy"); flashStatus("Copied"); } catch (e) { flashStatus("Select the text below and copy"); } }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(md).then(function () { flashStatus("Copied"); }, fallback);
  } else { fallback(); }
}

export function downloadResult() {
  var md = buildResultMarkdown();
  var blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "result.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  flashStatus("Downloaded result.md");
}

export function saveResultToFile() {
  var md = buildResultMarkdown();
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({
      suggestedName: "result.md",
      types: [{ description: "Markdown", accept: { "text/markdown": [".md"] } }]
    }).then(function (handle) {
      return handle.createWritable().then(function (writable) {
        return writable.write(md).then(function () { return writable.close(); });
      });
    }).then(function () { flashStatus("Saved to file"); })
      .catch(function (err) { if (err && err.name !== "AbortError") flashStatus("Save cancelled"); });
  } else {
    downloadResult();
  }
}
