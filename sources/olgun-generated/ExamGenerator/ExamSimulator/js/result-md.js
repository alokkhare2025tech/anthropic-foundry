// The result.md serialize/parse pair. buildResultMarkdown() emits the canonical
// "# QUESTIONS" / "# RESULT" report; parseResultReport() is its exact inverse,
// used to render a saved result.md back into a rich review. The two are tightly
// coupled by string shape — keep them together so they never drift.

import { state } from "./state.js";
import { DOMAIN_META } from "./constants.js";
import { computeResults, isCorrect } from "./scoring.js";

export function buildResultMarkdown() {
  var r = computeResults();
  var out = [];
  out.push("# QUESTIONS", "");

  [1, 2, 3, 4, 5].forEach(function (d) {
    var pd = r.perDomain[d];
    if (!pd) return;
    out.push("## " + d + ". " + DOMAIN_META[d].name + " (" + pd.correct + "/" + pd.total + ")", "");

    var missed = state.questions.filter(function (q) { return q.domainNum === d && !isCorrect(q); });
    if (missed.length === 0) {
      out.push("> 🟢 Evaluation: " + pd.correct + "/" + pd.total + " (All questions were answered correctly.)", "");
    } else {
      missed.forEach(function (q) {
        var k = state.key[q.num];
        var your = state.answers[q.num] || "—";
        if (q.subtopic && q.subtopic.id) out.push("### " + q.subtopic.id + " " + q.subtopic.name);
        out.push("**Q" + q.num + (q.scenario ? " — " + q.scenario : "") + "** · your answer: " + your + " · correct: " + k.correct, "");
        out.push(q.stem, "");
        ["A", "B", "C", "D"].forEach(function (L) {
          if (!(L in q.choices)) return;
          if (L === k.correct) out.push("- 🟢 Correct (" + L + "): " + q.choices[L]);
          else if (L === your) out.push("- 🔴 Your answer (" + L + "): " + q.choices[L]);
          else out.push("- " + L + ") " + q.choices[L]);
        });
        out.push("");
        ["A", "B", "C", "D"].forEach(function (L) {
          if (!(L in q.choices)) return;
          var why = (k.why && k.why[L]) ? k.why[L] : (L === k.correct ? k.explanation : "");
          if (why) out.push("Why-" + L + ": " + why);
        });
        out.push("");
        if (k.sources && k.sources.length) out.push("**Where this comes from:** " + k.sources.join("; "), "");
      });
    }
    out.push("---", "");
  });

  out.push("# RESULT", "");
  out.push("**Score:** " + r.score + "/" + r.total + " · " + (r.passed ? "PASSED" : "FAILED") +
    " · " + r.correctCount + " of " + r.totalQ + " correct (" + r.pct + "%) · Pass mark: " + r.pass, "");
  out.push("| Domain | Correct | Points |", "|--------|---------|--------|");
  [1, 2, 3, 4, 5].forEach(function (d) {
    var pd = r.perDomain[d];
    if (!pd) return;
    out.push("| D" + d + " " + DOMAIN_META[d].name + " | " + pd.correct + "/" + pd.total +
      " (" + Math.round(pd.acc * 100) + "%) | +" + pd.earnPts + " |");
  });
  out.push("");
  return out.join("\n");
}

// Parses the "# QUESTIONS" / "# RESULT" markdown produced by buildResultMarkdown()
// back into a structured object so a saved result.md can be rendered richly.
export function parseResultReport(md) {
  try {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var qIdx = -1, rIdx = -1;
    lines.forEach(function (l, i) {
      if (qIdx === -1 && /^# QUESTIONS/.test(l)) qIdx = i;
      if (/^# RESULT/.test(l)) rIdx = i;
    });
    if (qIdx === -1 || rIdx === -1) return null;

    var scoreLine = lines.slice(rIdx).filter(function (l) { return /^\*\*Score:\*\*/.test(l); })[0] || "";
    var sm = scoreLine.match(/\*\*Score:\*\*\s*(\d+)\/(\d+)\s*·\s*(PASSED|FAILED)\s*·\s*(\d+)\s*of\s*(\d+)\s*correct\s*\((\d+)%\)\s*·\s*Pass mark:\s*(\d+)/);
    if (!sm) return null;
    var top = {
      score: parseInt(sm[1], 10), total: parseInt(sm[2], 10), passed: sm[3] === "PASSED",
      correctCount: parseInt(sm[4], 10), totalQ: parseInt(sm[5], 10), pct: parseInt(sm[6], 10), pass: parseInt(sm[7], 10)
    };

    var earnByDomain = {};
    lines.slice(rIdx).forEach(function (l) {
      var tm = l.match(/^\|\s*D(\d+)\s+.*\|\s*\d+\/\d+\s*\(\d+%\)\s*\|\s*\+(\d+)\s*\|$/);
      if (tm) earnByDomain[parseInt(tm[1], 10)] = parseInt(tm[2], 10);
    });

    var body = lines.slice(qIdx + 1, rIdx).join("\n");
    var domainChunks = body.split(/\n(?=## \d+\.)/).filter(function (s) { return /^## \d+\./.test(s.trim()); });

    var domains = domainChunks.map(function (chunk) {
      var cLines = chunk.split("\n");
      var head = cLines[0].match(/^## (\d+)\.\s*(.*?)\s*\((\d+)\/(\d+)\)\s*$/);
      var domainNum = head ? parseInt(head[1], 10) : null;
      var domainName = head ? head[2].trim() : "";
      var correct = head ? parseInt(head[3], 10) : 0;
      var total = head ? parseInt(head[4], 10) : 0;
      var rest = cLines.slice(1).join("\n").replace(/\n---\s*$/, "");

      var missed = [];
      if (!/All questions were answered correctly/.test(rest)) {
        var segs = rest.split(/\n(?=### |\*\*Q\d+)/).filter(function (s) { return s.trim(); });
        var currentSubtopic = null;
        segs.forEach(function (seg) {
          seg = seg.replace(/^\n+/, "");
          if (/^### /.test(seg)) { currentSubtopic = seg.replace(/^###\s*/, "").trim(); return; }
          if (!/^\*\*Q\d+/.test(seg)) return;
          var qLines = seg.split("\n");
          var qm = qLines[0].match(/^\*\*Q(\d+)(?:\s*—\s*(.*?))?\*\*\s*·\s*your answer:\s*(\S+)\s*·\s*correct:\s*(\S+)/);
          if (!qm) return;
          var idx = 1;
          while (idx < qLines.length && qLines[idx].trim() === "") idx++;
          var stemLines = [];
          while (idx < qLines.length && !/^-\s/.test(qLines[idx]) && !/^Why-[A-D]:/.test(qLines[idx]) && !/^\*\*Where this comes from/.test(qLines[idx])) {
            stemLines.push(qLines[idx]); idx++;
          }
          var choices = [];
          while (idx < qLines.length && /^-\s/.test(qLines[idx])) {
            var line = qLines[idx];
            var m1 = line.match(/^-\s*🟢\s*Correct\s*\(([A-D])\):\s*(.*)$/);
            var m2 = line.match(/^-\s*🔴\s*Your answer\s*\(([A-D])\):\s*(.*)$/);
            var m3 = line.match(/^-\s*([A-D])\)\s*(.*)$/);
            if (m1) choices.push({ letter: m1[1], text: m1[2], tag: "correct" });
            else if (m2) choices.push({ letter: m2[1], text: m2[2], tag: "your" });
            else if (m3) choices.push({ letter: m3[1], text: m3[2], tag: null });
            idx++;
          }
          while (idx < qLines.length && qLines[idx].trim() === "") idx++;
          var whyMap = {};
          while (idx < qLines.length && /^Why-[A-D]:/.test(qLines[idx])) {
            var wm = qLines[idx].match(/^Why-([A-D]):\s*(.*)$/);
            if (wm) whyMap[wm[1]] = wm[2];
            idx++;
          }
          choices.forEach(function (c) { c.why = whyMap[c.letter] || ""; });
          var sources = "";
          var srcLine = qLines.slice(idx).filter(function (l) { return /^\*\*Where this comes from:\*\*/.test(l); })[0];
          if (srcLine) sources = srcLine.replace(/^\*\*Where this comes from:\*\*\s*/, "").trim();

          missed.push({
            num: parseInt(qm[1], 10), scenario: qm[2] || "", your: qm[3], correct: qm[4],
            subtopic: currentSubtopic, stem: stemLines.join("\n").trim(), choices: choices, sources: sources
          });
          currentSubtopic = null;
        });
      }

      return {
        domainNum: domainNum, domainName: domainName, correct: correct, total: total,
        earnPts: earnByDomain[domainNum] || 0, missed: missed
      };
    });

    return {
      score: top.score, total: top.total, passed: top.passed, correctCount: top.correctCount,
      totalQ: top.totalQ, pct: top.pct, pass: top.pass, domains: domains
    };
  } catch (e) { return null; }
}
