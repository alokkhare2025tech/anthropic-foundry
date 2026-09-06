// All view rendering: the sidebar navigator, question cards, the active-exam
// view, post-exam review, the results screen, and the saved-result screen.
// Rendering writes innerHTML then re-binds handlers (no framework).

import { state, els } from "./state.js";
import { DOMAIN_META } from "./constants.js";
import { escapeHtml, inlineCode, pad2, formatTime } from "./utils.js";
import { computeResults, isCorrect } from "./scoring.js";
import { buildResultMarkdown, parseResultReport } from "./result-md.js";
import { remainingSec } from "./timer.js";
import { retakeExam, finishExam, copyResult, downloadResult, saveResultToFile } from "./exam.js";

export function render() {
  renderSidebar();
  if (state.view === "exam") renderExamView();
  else if (state.view === "results") renderResultsView();
  else if (state.view === "review") renderReviewView();
  else if (state.view === "saved-result") renderSavedResultView();
}

function renderSavedResultView() {
  var rpt = parseResultReport(state.savedResultMd);
  var html = '<div class="results-head">Saved Result</div>' +
    '<h1 class="results-title">' + escapeHtml(state.examTitle) + "</h1>";

  if (!rpt) {
    html += '<div class="error-note">Couldn\'t parse the saved result report. See raw text below.</div>';
    html += '<details class="raw-report" open><summary>Raw report</summary>' +
      '<textarea class="report-pre" readonly>' + escapeHtml(state.savedResultMd) + "</textarea></details>";
    html += '<div class="controls"><span class="spacer"></span><button class="btn btn-primary" id="retakeBtn">Retake Exam</button></div>';
    els.main.innerHTML = html;
    bind("retakeBtn", retakeExam);
    return;
  }

  html += '<div class="score-card' + (rpt.passed ? "" : " fail") + '">' +
    '<div class="score-hero"><span class="score-earned">' + rpt.score + "</span>" +
    '<span class="score-slash"> / </span><span class="score-total">' + rpt.total + "</span></div>" +
    '<div class="verdict ' + (rpt.passed ? "verdict-pass" : "verdict-fail") + '">' + (rpt.passed ? "PASSED" : "FAILED") + "</div>" +
    '<div class="subline">' + rpt.correctCount + " of " + rpt.totalQ + " correct (" + rpt.pct + "%) · Pass mark: " + rpt.pass + "</div>" +
    "</div>";

  html += '<div class="domain-panel"><div class="domain-panel-head">Domain Breakdown</div>';
  rpt.domains.forEach(function (d) {
    var meta = DOMAIN_META[d.domainNum] || { name: d.domainName, color: "#8b93a6" };
    var pctD = d.total ? Math.round(d.correct / d.total * 100) : 0;
    html += '<div class="dom-row">' +
      '<div class="dom-row-top">' +
        '<span class="dom-dot" style="background:' + meta.color + '"></span>' +
        '<span class="dom-code">D' + d.domainNum + "</span>" +
        '<span class="dom-name">' + escapeHtml(meta.name || d.domainName) + "</span>" +
        '<span class="dom-stat">' + d.correct + "/" + d.total + " (" + pctD + "%)" +
          '<span class="dom-pts">+' + d.earnPts + "pts</span></span>" +
      "</div>" +
      '<div class="dom-bar"><div class="dom-fill" style="width:' + pctD + "%;background:" + meta.color + '"></div></div>' +
    "</div>";
  });
  html += "</div>";

  var missedTotal = rpt.domains.reduce(function (n, d) { return n + d.missed.length; }, 0);
  if (missedTotal) {
    html += '<div class="domain-panel"><div class="domain-panel-head">Questions to Review (' + missedTotal + ")</div>";
    rpt.domains.forEach(function (d) {
      d.missed.forEach(function (q) { html += missedQuestionCardHtml(q); });
    });
    html += "</div>";
  } else {
    html += '<div class="autosave-banner ok">All questions were answered correctly.</div>';
  }

  html += '<details class="raw-report"><summary>View raw report</summary>' +
    '<textarea class="report-pre" readonly>' + escapeHtml(state.savedResultMd) + "</textarea></details>";

  html += '<div class="controls"><span class="spacer"></span>' +
    '<button class="btn btn-primary" id="retakeBtn">Retake Exam</button></div>';
  els.main.innerHTML = html;
  bind("retakeBtn", retakeExam);
}

function missedQuestionCardHtml(q) {
  var html = '<article class="card incorrect mini-review">';
  html += '<div class="q-badge"><span class="qb-main"><span class="qb-pos">Q' + q.num + "</span>";
  if (q.subtopic) html += '<span class="qb-subid">' + escapeHtml(q.subtopic) + "</span>";
  html += "</span></div>";
  if (q.scenario) html += '<div class="mini-scenario">' + escapeHtml(q.scenario) + "</div>";
  if (q.stem) html += '<p class="q-stem mini-stem">' + inlineCode(escapeHtml(q.stem)).replace(/\n/g, "<br>") + "</p>";
  html += '<div class="result-banner"><span class="result-banner-icon">' + resultIconSvg("incorrect", 20) + "</span>" +
    '<span><div class="result-banner-title">Incorrect</div>' +
    '<div class="result-banner-sub">Review the explanations to understand the correct answer.</div></span></div>';
  html += '<div class="choices">';
  q.choices.forEach(function (c) {
    var cls = "choice locked";
    var tag = "";
    if (c.tag === "correct") { cls += " is-correct"; tag = '<span class="tag tag-correct">' + resultIconSvg("correct", 14) + "correct answer</span>"; }
    else if (c.tag === "your") { cls += " is-your"; tag = '<span class="tag tag-your">' + resultIconSvg("incorrect", 14) + "your answer</span>"; }
    var why = "";
    if (c.why) {
      var whyBody = '<div class="choice-why">' + inlineCode(escapeHtml(c.why)) + "</div>";
      why = '<details class="choice-why-details"><summary>Explanation</summary>' + whyBody + "</details>";
    }
    html += '<div class="' + cls + '"><span class="choice-body"><span class="choice-head">' +
      '<span class="choice-letter">' + c.letter + ")</span><span class=\"choice-text\">" + inlineCode(escapeHtml(c.text)) + "</span>" + tag +
      "</span>" + why + "</span></div>";
  });
  html += "</div>";
  if (q.sources) html += '<div class="source-box"><div class="source-head">Where this comes from</div><div>' + escapeHtml(q.sources) + "</div></div>";
  html += "</article>";
  return html;
}

function renderSidebar() {
  if (state.view === "empty" || !state.questions.length) { els.sidebar.innerHTML = ""; return; }

  var answered = state.questions.filter(function (q) { return state.answers[q.num]; }).length;
  var html = '<div class="nav-head"><span>Questions</span>' +
    '<span class="nav-count">' + answered + "/" + state.questions.length + "</span></div>";
  var showResults = state.finished || (state.mode === "review" && !!state.key);
  html += '<div class="chips">';
  state.questions.forEach(function (q, i) {
    var cls = "chip";
    if (showResults && state.answers[q.num]) {
      cls += isCorrect(q) ? " correct" : " incorrect";
    } else if (state.answers[q.num]) {
      cls += " answered";
    }
    if (state.flags[q.num]) cls += " flagged";
    if (i === state.current && (state.view === "exam" || state.view === "review")) cls += " current";
    html += '<button class="' + cls + '" data-idx="' + i + '">' + q.num + "</button>";
  });
  html += "</div>";

  if (state.finished) {
    html += '<div class="nav-legend">' +
      '<span class="dot" style="background:var(--correct)"></span>correct<br>' +
      '<span class="dot" style="background:var(--incorrect)"></span>incorrect<br>' +
      '<span class="dot" style="background:var(--incorrect)"></span>flagged</div>';
  } else if (showResults) {
    html += '<div class="nav-legend">' +
      '<span class="dot" style="background:var(--correct)"></span>correct<br>' +
      '<span class="dot" style="background:var(--incorrect)"></span>incorrect<br>' +
      '<span class="dot" style="background:var(--incorrect)"></span>flagged</div>';
  } else {
    html += '<div class="nav-legend">Click a number to jump. Unanswered = incorrect.<br>' +
      '<span class="dot" style="background:var(--incorrect)"></span>flagged for review</div>';
  }

  els.sidebar.innerHTML = html;
  els.sidebar.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.current = parseInt(chip.dataset.idx, 10);
      if (state.finished) state.view = "review";
      render();
      window.scrollTo(0, 0);
    });
  });
}

function badgeHtml(q, pos, mode) {
  var domainNum = q.domainNum || 0;
  var meta = DOMAIN_META[domainNum];
  var parts = [];
  parts.push('<span class="qb-pos">Question ' + pad2(pos) + " of " + pad2(state.questions.length) + "</span>");
  if (domainNum) {
    parts.push(
      '<span class="qb-dot" style="background:' + (meta ? meta.color : "var(--text-dim)") + '"></span>' +
      '<span class="qb-dname">' + escapeHtml(q.domainName || "") + "</span>"
    );
  } else if (q.domainName) {
    parts.push('<span class="qb-dname">' + escapeHtml(q.domainName) + "</span>");
  }
  var line1 = '<span class="qb-line1">' + parts.join('<span class="sep">•</span>') + "</span>";
  var subHtml = q.subtopic && q.subtopic.id
    ? '<span class="qb-subid">' + escapeHtml(q.subtopic.id + " " + q.subtopic.name) + "</span>"
    : "";

  var main = '<span class="qb-main">' + line1 + subHtml + "</span>";
  var trailing;
  if (mode === "review") {
    trailing = "";
  } else {
    var flagged = !!state.flags[q.num];
    var flagIcon = '<svg class="flag-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 21V4a1 1 0 0 1 1-1h13a.5.5 0 0 1 .38.82L15.6 8.5l3.78 4.68A.5.5 0 0 1 19 14H6a1 1 0 0 0-1 1"/></svg>';
    trailing = '<button type="button" class="flag-btn' + (flagged ? " is-flagged" : "") +
      '" id="flagBtn" aria-pressed="' + flagged + '">' + flagIcon +
      '<span>' + (flagged ? "Flagged" : "Flag") + "</span></button>";
  }
  return '<div class="q-badge">' + main + trailing + "</div>";
}

function resultIconSvg(kind, size) {
  size = size || 18;
  var inner = kind === "correct"
    ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l2.5 2.5L16 9.5"></path>'
    : '<circle cx="12" cy="12" r="10"></circle><path d="M9 9l6 6M15 9l-6 6"></path>';
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>";
}

function resultBannerHtml(q) {
  var ok = isCorrect(q);
  return '<div class="result-banner' + (ok ? " is-correct" : "") + '">' +
    '<span class="result-banner-icon">' + resultIconSvg(ok ? "correct" : "incorrect", 20) + "</span>" +
    "<span><div class=\"result-banner-title\">" + (ok ? "Correct" : "Incorrect") + "</div>" +
    '<div class="result-banner-sub">' + (ok ? "Nice work — review the explanations below to reinforce why." : "Review the explanations to understand the correct answer.") + "</div></span>" +
  "</div>";
}

function stemHtml(q) {
  return '<p class="q-stem">' + inlineCode(escapeHtml(q.stem)).replace(/\n/g, "<br>") + "</p>";
}

function scenarioCardHtml(q) {
  if (!q.scenarioBody) return "";
  return '<div class="scenario-card">' +
    '<div class="scenario-card-head"><span class="scenario-icon">&#128196;</span><span class="scenario-title">' +
    escapeHtml(q.scenario || "Scenario") + "</span></div>" +
    '<p class="scenario-card-body">' + inlineCode(escapeHtml(q.scenarioBody)).replace(/\n/g, "<br>") + "</p>" +
  "</div>";
}

function optionRowHtml(q, letter, mode) {
  if (!(letter in q.choices)) return "";
  var k = state.key && state.key[q.num];
  var your = state.answers[q.num];
  var cls = "choice";
  var tag = "";
  var input;

  if (mode === "review") {
    cls += " locked";
    if (k && letter === k.correct) { cls += " is-correct"; tag = '<span class="tag tag-correct">' + resultIconSvg("correct", 14) + "correct answer</span>"; }
    else if (letter === your) { cls += " is-your"; tag = '<span class="tag tag-your">' + resultIconSvg("incorrect", 14) + "your answer</span>"; }
    input = '<input type="radio" disabled' + (letter === your ? " checked" : "") + ">";
  } else {
    input = '<input type="radio" name="q' + q.num + '" value="' + letter + '"' +
      (your === letter ? " checked" : "") + ">";
  }

  var why = "";
  if (mode === "review" && k) {
    var isKeyChoice = letter === k.correct || letter === your;
    var whyText = (k.why && k.why[letter]) ? k.why[letter] : (isKeyChoice ? k.explanation : "");
    if (whyText) {
      var whyBody = '<div class="choice-why">' + inlineCode(escapeHtml(whyText)) + "</div>";
      why = '<details class="choice-why-details"><summary>Explanation</summary>' + whyBody + "</details>";
    }
  }

  return '<label class="' + cls + '">' + input +
    '<span class="choice-body">' +
      '<span class="choice-head">' +
        '<span class="choice-letter">' + letter + ")</span>" +
        '<span class="choice-text">' + inlineCode(escapeHtml(q.choices[letter])) + "</span>" +
        tag +
      "</span>" + why +
    "</span></label>";
}

function cardHtml(q, pos, mode) {
  var cls = "card";
  if (mode === "review") cls += isCorrect(q) ? " correct" : " incorrect";
  var html = '<article class="' + cls + '">' + badgeHtml(q, pos, mode) + stemHtml(q) + scenarioCardHtml(q);
  if (mode === "review") html += resultBannerHtml(q);
  html += '<div class="choices" role="radiogroup" aria-label="Question ' + pos + '">';
  ["A", "B", "C", "D"].forEach(function (L) { html += optionRowHtml(q, L, mode); });
  html += "</div>";

  if (mode === "review") {
    var k = state.key && state.key[q.num];
    if (k && k.sources && k.sources.length) {
      html += '<div class="source-box"><div class="source-head">Where this comes from</div><ul>';
      k.sources.forEach(function (s) { html += "<li>" + escapeHtml(s) + "</li>"; });
      html += "</ul></div>";
    }
  }
  html += "</article>";
  return html;
}

function progressHtml() {
  var answered = state.questions.filter(function (q) { return state.answers[q.num]; }).length;
  var pct = state.questions.length ? Math.round(answered / state.questions.length * 100) : 0;
  var metaHtml;
  if (state.mode === "review") {
    var correctSoFar = state.questions.filter(function (q) { return state.answers[q.num] && isCorrect(q); }).length;
    var pctCorrect = answered ? Math.round(correctSoFar / answered * 100) : 0;
    metaHtml = '<span class="exam-live-score">' + correctSoFar + " / " + answered + " correct (" + pctCorrect + "%)</span>";
  } else {
    metaHtml = '<span class="exam-timer" id="examTimer">' + formatTime(remainingSec()) + "</span>";
  }
  return '<div class="exam-top">' +
    '<div class="exam-top-row"><h1>' + escapeHtml(state.examTitle) + "</h1>" +
    '<div class="exam-top-meta">' +
      metaHtml +
      '<span class="exam-pos">Question ' + (state.current + 1) + " of " + state.questions.length + "</span>" +
    "</div></div>" +
    '<div class="progress"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';
}

function renderExamView() {
  var q = state.questions[state.current];
  var last = state.current === state.questions.length - 1;
  var confirmed = !!state.answers[q.num];
  var immediateFeedback = state.mode === "review" && confirmed;
  var cardMode = immediateFeedback ? "review" : "exam";
  var html = progressHtml() + cardHtml(q, q.num, cardMode);

  html += '<div class="controls">' +
    '<button class="btn" id="prevBtn"' + (state.current === 0 ? " disabled" : "") + ">Previous</button>" +
    '<button class="btn" id="nextBtn"' + (last ? " disabled" : "") + ">Next</button>" +
    '<span class="spacer"></span>';
  if (state.mode === "review") {
    if (!confirmed) html += '<button class="btn btn-primary" id="confirmBtn" disabled>Confirm answer</button>';
  } else {
    html += '<button class="btn btn-primary" id="finishBtn">Finish exam</button>';
  }
  html += "</div>";
  els.main.innerHTML = html;

  function updateProgressFill() {
    els.main.querySelector(".progress-fill").style.width =
      Math.round(state.questions.filter(function (x) { return state.answers[x.num]; }).length / state.questions.length * 100) + "%";
  }

  if (!immediateFeedback) {
    var radios = els.main.querySelectorAll('input[type="radio"]');
    if (state.mode === "review") {
      radios.forEach(function (input) {
        input.addEventListener("change", function () {
          var confirmBtn = document.getElementById("confirmBtn");
          if (confirmBtn) confirmBtn.disabled = false;
        });
      });
      bind("confirmBtn", function () {
        var checked = els.main.querySelector('input[name="q' + q.num + '"]:checked');
        if (!checked) return;
        state.answers[q.num] = checked.value;
        var allAnswered = state.questions.every(function (x) { return !!state.answers[x.num]; });
        if (allAnswered) { finishExam(true); return; }
        render();
        window.scrollTo(0, 0);
      });
    } else {
      radios.forEach(function (input) {
        input.addEventListener("click", function () {
          if (state.answers[q.num] === input.value) {
            input.checked = false;
            delete state.answers[q.num];
            renderSidebar();
            updateProgressFill();
          }
        });
        input.addEventListener("change", function () {
          state.answers[q.num] = input.value;
          renderSidebar();
          updateProgressFill();
        });
      });
    }
  }
  bind("prevBtn", function () { goTo(state.current - 1); });
  bind("nextBtn", function () { goTo(state.current + 1); });
  bind("finishBtn", finishExam);
  bind("flagBtn", function () {
    state.flags[q.num] = !state.flags[q.num];
    render();
  });
}

function renderReviewView() {
  var q = state.questions[state.current];
  var last = state.current === state.questions.length - 1;
  var html = '<div class="exam-top"><div class="exam-top-row"><h1>Review — ' + escapeHtml(state.examTitle) + "</h1>" +
    '<span class="exam-pos">Question ' + (state.current + 1) + " of " + state.questions.length + "</span></div></div>";
  html += cardHtml(q, q.num, "review");
  html += '<div class="controls">' +
    '<button class="btn" id="prevBtn"' + (state.current === 0 ? " disabled" : "") + ">Previous</button>" +
    '<button class="btn" id="nextBtn"' + (last ? " disabled" : "") + ">Next</button>" +
    '<span class="spacer"></span>' +
    '<button class="btn btn-ghost" id="backBtn">Back to results</button>' +
    "</div>";
  els.main.innerHTML = html;

  bind("prevBtn", function () { goTo(state.current - 1); });
  bind("nextBtn", function () { goTo(state.current + 1); });
  bind("backBtn", function () { state.view = "results"; render(); window.scrollTo(0, 0); });
}

function renderResultsView() {
  var r = computeResults();
  var html = '<div class="results-head">Results</div><h1 class="results-title">Exam Results</h1>';

  html += '<div class="autosave-banner" id="autosaveBanner">Saving automatically…</div>';

  html += '<div class="score-card' + (r.passed ? "" : " fail") + '">' +
    '<div class="score-hero"><span class="score-earned">' + r.score + "</span>" +
    '<span class="score-slash"> / </span><span class="score-total">' + r.total + "</span></div>" +
    '<div class="verdict ' + (r.passed ? "verdict-pass" : "verdict-fail") + '">' + (r.passed ? "PASSED" : "FAILED") + "</div>" +
    '<div class="subline">' + r.correctCount + " of " + r.totalQ + " correct (" + r.pct + "%) · Pass mark: " + r.pass + "</div>" +
    "</div>";

  html += '<div class="domain-panel"><div class="domain-panel-head">Domain Breakdown</div>';
  r.present.forEach(function (d) {
    var pd = r.perDomain[d];
    var meta = DOMAIN_META[d];
    var pctD = Math.round(pd.acc * 100);
    html += '<div class="dom-row">' +
      '<div class="dom-row-top">' +
        '<span class="dom-dot" style="background:' + meta.color + '"></span>' +
        '<span class="dom-code">D' + d + "</span>" +
        '<span class="dom-name">' + escapeHtml(meta.name) + "</span>" +
        '<span class="dom-stat">' + pd.correct + "/" + pd.total + " (" + pctD + "%)" +
          '<span class="dom-pts">+' + pd.earnPts + "pts</span></span>" +
      "</div>" +
      '<div class="dom-bar"><div class="dom-fill" style="width:' + pctD + "%;background:" + meta.color + '"></div></div>' +
    "</div>";
  });
  html += "</div>";

  var missed = state.questions.filter(function (q) { return !isCorrect(q); });
  if (missed.length) {
    html += '<div class="domain-panel"><div class="domain-panel-head">Questions to Review (' + missed.length + ")</div>";
    missed.forEach(function (q) { html += cardHtml(q, q.num, "review"); });
    html += "</div>";
  } else {
    html += '<div class="autosave-banner ok">All questions were answered correctly.</div>';
  }

  html += '<div class="save-panel"><div class="save-head">Save report</div>' +
    '<div class="save-buttons">' +
      '<button class="btn" id="copyBtn">Copy report</button>' +
      '<button class="btn" id="downloadBtn">Download result.md</button>' +
      '<button class="btn btn-primary" id="saveFileBtn">Save to file…</button>' +
      '<span class="save-status" id="saveStatus"></span>' +
    "</div>" +
    '<div class="save-hint">The report below is the canonical <code>result.md</code> format. ' +
      "It's saved automatically to <code>GeneratedExams/" + escapeHtml(state.examId) + "/result.md</code> " +
      "when the exam finishes (Chrome/Edge only — first time you'll be asked to grant access to the " +
      "<code>GeneratedExams</code> folder). Use “Save to file…” to save it again manually if needed; " +
      "Copy and Download work in any browser.</div>" +
    '<textarea class="report-pre" id="reportText" readonly>' + escapeHtml(buildResultMarkdown()) + "</textarea>" +
  "</div>";

  html += '<div class="review-hint">Or click any question number in the sidebar to jump directly to it.</div>';

  els.main.innerHTML = html;

  bind("copyBtn", copyResult);
  bind("downloadBtn", downloadResult);
  bind("saveFileBtn", saveResultToFile);
}

export function goTo(idx) {
  if (idx < 0 || idx >= state.questions.length) return;
  state.current = idx;
  render();
  window.scrollTo(0, 0);
}

function bind(id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); }
