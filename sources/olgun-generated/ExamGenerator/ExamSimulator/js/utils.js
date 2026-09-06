// Pure helpers plus the fetch wrapper and its error renderer.

import { els } from "./state.js";

export function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Render `backtick code` spans inside already-escaped text.
export function inlineCode(escaped) {
  return escaped.replace(/`([^`]+)`/g, function (_, code) { return "<code>" + code + "</code>"; });
}

export function pad2(n) { n = String(n); while (n.length < 2) n = "0" + n; return n; }

export function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

export function fetchText(path) {
  return fetch(path).then(function (res) {
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + path);
    return res.text();
  });
}

export function showFetchError(err) {
  els.sidebar.innerHTML = "";
  els.main.innerHTML =
    '<div class="error-note">' +
    "Can't reach the exam files (" + escapeHtml(err.message) + "). " +
    "This page needs to be served over a local static server, not opened directly. " +
    "From the repo root, run <code>npx serve ExamGenerator</code> or " +
    "<code>python -m http.server --directory ExamGenerator 5500</code>, then open " +
    "<code>/ExamSimulator/index.html</code> and reload." +
    "</div>";
}
