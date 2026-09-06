#!/usr/bin/env node
// Validates every exam registered in GeneratedExams/manifest.json against the format
// contract documented in ExamGenerator/README.md — which is really the parser contract
// of ExamSimulator/js/parse.js. A violation there doesn't crash anything: the simulator
// silently drops a question, mislabels a domain, or renders a card without its scenario.
// This makes those failures loud and deterministic instead of leaving them to the
// exam-generator skill's prose self-check.
//
// Errors are contract violations. Warnings are quality signals that still parse fine.
//
// Usage: node scripts/validate-exams.js [--strict]
//   --strict  treat warnings as errors too

const fs = require("fs");
const path = require("path");

const GENERATED_EXAMS_DIR = path.join(__dirname, "..", "ExamGenerator", "GeneratedExams");
const MANIFEST_PATH = path.join(GENERATED_EXAMS_DIR, "manifest.json");

// Mirrors DOMAIN_META in ExamGenerator/ExamSimulator/js/constants.js. That file is an ES
// module and can't be require()d from CommonJS, and the repo deliberately has no build
// step, so the names are duplicated here — keep the two in sync. The subtopic counts are
// the blueprint ranges from .claude/skills/cert-exam-generator/SKILL.md (domain N covers
// N.1 through N.<subtopics>).
const DOMAINS = {
  1: { name: "Agentic Architecture & Orchestration", subtopics: 7 },
  2: { name: "Tool Design & MCP Integration", subtopics: 5 },
  3: { name: "Claude Code Configuration & Workflows", subtopics: 6 },
  4: { name: "Prompt Engineering & Structured Output", subtopics: 6 },
  5: { name: "Context Management & Reliability", subtopics: 6 }
};

// A single correct-answer letter appearing in more than this fraction of an exam's
// questions is a tell a candidate can learn instead of the material.
const LETTER_SKEW_THRESHOLD = 0.4;

const errors = [];
const warnings = [];

function error(file, line, msg) {
  errors.push({ file, line, msg });
}

function warn(file, line, msg) {
  warnings.push({ file, line, msg });
}

// Repo-relative, forward-slashed, so the terminal renders it as a clickable path.
function rel(absPath) {
  return path.relative(path.join(__dirname, ".."), absPath).split(path.sep).join("/");
}

function readLines(absPath) {
  return fs.readFileSync(absPath, "utf8").replace(/\r\n/g, "\n").split("\n");
}

// --- exam.md ---------------------------------------------------------------

// Splits the file into { num, start, lines } blocks, one per `## Q<n>` heading.
function splitQuestionBlocks(lines) {
  const blocks = [];
  lines.forEach((line, i) => {
    const m = line.match(/^## Q(\d+)\s*$/);
    if (m) blocks.push({ num: parseInt(m[1], 10), start: i, lines: [] });
    if (blocks.length) blocks[blocks.length - 1].lines.push({ text: line, line: i + 1 });
  });
  return blocks;
}

function parseExamFile(id, file, lines) {
  const questions = [];

  if (lines[0] !== `# Exam ${id}`) {
    error(file, 1, `first line must be "# Exam ${id}", found ${JSON.stringify(lines[0])}`);
  }

  const firstQIdx = lines.findIndex((l) => /^## Q\d+/.test(l));
  const header = firstQIdx === -1 ? lines : lines.slice(0, firstQIdx);

  const titleIdx = header.findIndex((l) => /^Title:/.test(l));
  if (titleIdx === -1) error(file, 1, "missing `Title:` line in the header");
  else if (!header[titleIdx].replace(/^Title:\s*/, "").trim()) {
    error(file, titleIdx + 1, "`Title:` is empty");
  }

  const totalIdx = header.findIndex((l) => /^Total:/.test(l));
  let declaredTotal = null;
  if (totalIdx === -1) {
    error(file, 1, "missing `Total:` line in the header");
  } else {
    const raw = header[totalIdx].replace(/^Total:\s*/, "").trim();
    if (!/^\d+$/.test(raw)) error(file, totalIdx + 1, `\`Total:\` must be an integer, found ${JSON.stringify(raw)}`);
    else declaredTotal = parseInt(raw, 10);
  }

  const blocks = splitQuestionBlocks(lines);

  if (blocks.length === 0) {
    error(file, 1, "no `## Q<n>` question blocks found");
    return questions;
  }
  if (declaredTotal !== null && declaredTotal !== blocks.length) {
    error(file, totalIdx + 1, `\`Total: ${declaredTotal}\` but the file contains ${blocks.length} question block(s)`);
  }

  blocks.forEach((block, i) => {
    const expected = i + 1;
    if (block.num !== expected) {
      error(file, block.start + 1, `question numbers must be sequential from 1 — expected \`## Q${expected}\`, found \`## Q${block.num}\``);
    }

    const body = block.lines.slice(1);
    let idx = 0;
    const skipBlank = () => { while (idx < body.length && body[idx].text.trim() === "") idx++; };

    skipBlank();

    // Domain: required, first meta line, must match the taxonomy exactly.
    let domainNum = null;
    if (idx >= body.length || !/^Domain:/.test(body[idx].text)) {
      error(file, block.start + 1, `Q${block.num}: missing \`Domain:\` line (must be the first line after the heading)`);
    } else {
      const raw = body[idx].text.replace(/^Domain:\s*/, "").trim();
      const m = raw.match(/^(\d+)\.\s*(.*)$/);
      if (!m) {
        error(file, body[idx].line, `Q${block.num}: \`Domain:\` must be "<n>. <name>", found ${JSON.stringify(raw)}`);
      } else {
        domainNum = parseInt(m[1], 10);
        const meta = DOMAINS[domainNum];
        if (!meta) error(file, body[idx].line, `Q${block.num}: unknown domain number ${domainNum} (expected 1-5)`);
        else if (m[2].trim() !== meta.name) {
          error(file, body[idx].line, `Q${block.num}: domain ${domainNum} is "${meta.name}", found ${JSON.stringify(m[2].trim())}`);
        }
      }
      idx++;
    }

    // Subtopic: optional, but when present it must follow Domain: immediately.
    let subtopic = null;
    if (idx < body.length && /^Subtopic:/.test(body[idx].text)) {
      const raw = body[idx].text.replace(/^Subtopic:\s*/, "").trim();
      const m = raw.match(/^(\d+)\.(\d+)\s+(\S.*)$/);
      if (!m) {
        error(file, body[idx].line, `Q${block.num}: \`Subtopic:\` must be "<d>.<s> <name>", found ${JSON.stringify(raw)}`);
      } else {
        const d = parseInt(m[1], 10);
        const s = parseInt(m[2], 10);
        if (domainNum !== null && d !== domainNum) {
          error(file, body[idx].line, `Q${block.num}: subtopic ${d}.${s} does not belong to domain ${domainNum}`);
        }
        const meta = DOMAINS[d];
        if (meta && (s < 1 || s > meta.subtopics)) {
          error(file, body[idx].line, `Q${block.num}: subtopic ${d}.${s} is out of range — domain ${d} covers ${d}.1-${d}.${meta.subtopics}`);
        }
        subtopic = { id: `${d}.${s}`, name: m[3].trim(), line: body[idx].line };
      }
      idx++;
    }

    // Scenario: optional, but when present it must follow Subtopic: and carry a value —
    // an empty one renders a blank badge on the card.
    if (idx < body.length && /^Scenario:/.test(body[idx].text)) {
      const raw = body[idx].text.replace(/^Scenario:\s*/, "").trim();
      if (!raw) error(file, body[idx].line, `Q${block.num}: \`Scenario:\` is present but empty — drop the line or give it a scenario-family title`);
      idx++;
    }

    if (idx < body.length && /^(Domain|Subtopic|Scenario):/.test(body[idx].text)) {
      error(file, body[idx].line, `Q${block.num}: meta lines must appear in the order Domain, Subtopic, Scenario, each at most once`);
    }

    // Stem paragraphs, up to the first choice.
    const stemLines = [];
    while (idx < body.length && !/^[A-D]\)/.test(body[idx].text)) {
      stemLines.push(body[idx].text);
      idx++;
    }
    const paragraphs = stemLines.join("\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) {
      error(file, block.start + 1, `Q${block.num}: question stem is empty`);
    } else if (paragraphs.length < 2) {
      warn(file, block.start + 1, `Q${block.num}: stem is a single paragraph — the house style is a generic setup paragraph followed by the incident and the question`);
    }

    // Exactly four choices, A-D, in order, each with text.
    const choices = {};
    const seen = [];
    while (idx < body.length) {
      const m = body[idx].text.match(/^([A-D])\)\s*(.*)$/);
      if (m) {
        if (choices[m[1]] !== undefined) error(file, body[idx].line, `Q${block.num}: duplicate choice ${m[1]}`);
        if (!m[2].trim()) error(file, body[idx].line, `Q${block.num}: choice ${m[1]} has no text`);
        choices[m[1]] = m[2].trim();
        seen.push(m[1]);
      }
      idx++;
    }
    const missing = ["A", "B", "C", "D"].filter((l) => choices[l] === undefined);
    if (missing.length) {
      error(file, block.start + 1, `Q${block.num}: missing choice(s) ${missing.join(", ")} — exactly four (A-D) are required`);
    } else if (seen.join("") !== "ABCD") {
      error(file, block.start + 1, `Q${block.num}: choices must appear in A, B, C, D order, found ${seen.join(", ")}`);
    }

    questions.push({ num: block.num, line: block.start + 1, domainNum, subtopic, choices });
  });

  return questions;
}

// --- answer-key.md ---------------------------------------------------------

function validateAnswerKey(file, lines, questions) {
  const blocks = splitQuestionBlocks(lines);
  const byNum = new Map();

  blocks.forEach((block) => {
    if (byNum.has(block.num)) {
      error(file, block.start + 1, `duplicate entry for Q${block.num}`);
      return;
    }
    byNum.set(block.num, block);
  });

  const examNums = new Set(questions.map((q) => q.num));
  blocks.forEach((block) => {
    if (!examNums.has(block.num)) {
      error(file, block.start + 1, `Q${block.num} has no matching question in exam.md`);
    }
  });

  questions.forEach((q) => {
    const block = byNum.get(q.num);
    if (!block) {
      error(file, 1, `missing entry for Q${q.num} (present in exam.md)`);
      return;
    }

    const fields = { correct: null, explanation: null, why: {}, sources: 0 };
    block.lines.slice(1).forEach((entry) => {
      const c = entry.text.match(/^Correct:\s*(.*)$/);
      const e = entry.text.match(/^Explanation:\s*(.*)$/);
      const w = entry.text.match(/^Why-([A-D]):\s*(.*)$/);
      const s = entry.text.match(/^Source:\s*(.*)$/);
      if (c) fields.correct = { value: c[1].trim(), line: entry.line };
      else if (e) fields.explanation = { value: e[1].trim(), line: entry.line };
      else if (w) fields.why[w[1]] = { value: w[2].trim(), line: entry.line };
      else if (s && s[1].trim()) fields.sources++;
    });

    if (!fields.correct) {
      error(file, block.start + 1, `Q${q.num}: missing \`Correct:\` line`);
    } else if (!/^[A-D]$/.test(fields.correct.value)) {
      error(file, fields.correct.line, `Q${q.num}: \`Correct:\` must be a single letter A-D, found ${JSON.stringify(fields.correct.value)}`);
    } else if (q.choices[fields.correct.value] === undefined) {
      error(file, fields.correct.line, `Q${q.num}: \`Correct: ${fields.correct.value}\` but exam.md has no choice ${fields.correct.value}`);
    }

    if (!fields.explanation) error(file, block.start + 1, `Q${q.num}: missing \`Explanation:\` line`);
    else if (!fields.explanation.value) error(file, fields.explanation.line, `Q${q.num}: \`Explanation:\` is empty`);

    const whyLetters = Object.keys(fields.why);
    Object.keys(fields.why).forEach((letter) => {
      if (!fields.why[letter].value) error(file, fields.why[letter].line, `Q${q.num}: \`Why-${letter}:\` is empty`);
      if (q.choices[letter] === undefined) error(file, fields.why[letter].line, `Q${q.num}: \`Why-${letter}:\` has no matching choice in exam.md`);
    });
    if (whyLetters.length > 0 && whyLetters.length < 4) {
      const absent = ["A", "B", "C", "D"].filter((l) => !fields.why[l]);
      warn(file, block.start + 1, `Q${q.num}: per-option rationale is partial — missing Why-${absent.join(", Why-")}`);
    }

    if (fields.sources === 0) {
      warn(file, block.start + 1, `Q${q.num}: no \`Source:\` line — an unsourceable question can't be traced back to a lesson`);
    }

    q.correct = fields.correct && /^[A-D]$/.test(fields.correct.value) ? fields.correct.value : null;
  });
}

// --- cross-exam and manifest checks ----------------------------------------

// There is no canonical subtopic-name table anywhere in the repo (SKILL.md defines only
// the id ranges), so rather than inventing one, require that every exam spells a given
// subtopic id the same way. That catches drift without freezing the wording.
function checkSubtopicConsistency(allQuestions) {
  const byId = new Map();
  allQuestions.forEach(({ file, question }) => {
    if (!question.subtopic) return;
    if (!byId.has(question.subtopic.id)) byId.set(question.subtopic.id, new Map());
    const names = byId.get(question.subtopic.id);
    if (!names.has(question.subtopic.name)) names.set(question.subtopic.name, []);
    names.get(question.subtopic.name).push({ file, line: question.subtopic.line });
  });

  byId.forEach((names, id) => {
    if (names.size < 2) return;
    // Report the minority spellings against the most common one.
    const sorted = [...names.entries()].sort((a, b) => b[1].length - a[1].length);
    const [dominant] = sorted[0];
    sorted.slice(1).forEach(([name, uses]) => {
      uses.forEach((use) => {
        error(use.file, use.line, `subtopic ${id} is spelled ${JSON.stringify(name)} here but ${JSON.stringify(dominant)} elsewhere — pick one`);
      });
    });
  });
}

function checkLetterSkew(file, questions) {
  const answered = questions.filter((q) => q.correct);
  if (answered.length < 5) return;
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  answered.forEach((q) => { counts[q.correct]++; });
  Object.keys(counts).forEach((letter) => {
    const share = counts[letter] / answered.length;
    if (share > LETTER_SKEW_THRESHOLD) {
      warn(file, 1, `correct answer is ${letter} in ${counts[letter]} of ${answered.length} questions (${Math.round(share * 100)}%) — a candidate can learn the letter instead of the material`);
    }
  });
}

// Same derivation as scripts/sync-manifest.js, so a stale manifest is caught in CI on
// clones that never ran `git config core.hooksPath .githooks`.
function deriveManifest() {
  const ids = fs
    .readdirSync(GENERATED_EXAMS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(GENERATED_EXAMS_DIR, id, "exam.md")));
  const numeric = ids.filter((id) => /^\d+$/.test(id)).sort((a, b) => Number(a) - Number(b));
  const named = ids.filter((id) => !/^\d+$/.test(id) && id !== "_sample").sort();
  const sample = ids.includes("_sample") ? ["_sample"] : [];
  return [...sample, ...named, ...numeric];
}

// --- entry point -----------------------------------------------------------

function main() {
  const strict = process.argv.includes("--strict");
  const manifestFile = rel(MANIFEST_PATH);

  let ids;
  try {
    ids = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch (e) {
    console.error(`${manifestFile}:1: not valid JSON — ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(ids)) {
    console.error(`${manifestFile}:1: must be a flat JSON array of exam ids`);
    process.exit(1);
  }

  // Compare the parsed ids rather than the raw bytes. The file is stored with LF but
  // checks out as CRLF wherever core.autocrlf is on, so a byte comparison would pass on
  // Windows and fail on a Linux runner. What the simulator consumes is the parsed array,
  // and that is what has to match the folders on disk.
  const derived = deriveManifest();
  if (JSON.stringify(ids) !== JSON.stringify(derived)) {
    error(manifestFile, 1, `out of sync with the folders on disk — run \`node scripts/sync-manifest.js\` (expected ${JSON.stringify(derived)})`);
  }

  const allQuestions = [];

  ids.forEach((id) => {
    const dir = path.join(GENERATED_EXAMS_DIR, id);
    const examPath = path.join(dir, "exam.md");
    const keyPath = path.join(dir, "answer-key.md");
    const examFile = rel(examPath);
    const keyFile = rel(keyPath);

    if (!fs.existsSync(examPath)) {
      error(examFile, 1, `exam "${id}" is registered in manifest.json but has no exam.md`);
      return;
    }

    const examLines = readLines(examPath);
    if (examLines.join("").trim() === "") {
      error(examFile, 1, "file is empty");
      return;
    }

    const questions = parseExamFile(id, examFile, examLines);

    if (!fs.existsSync(keyPath)) {
      error(keyFile, 1, `exam "${id}" has no answer-key.md`);
    } else {
      const keyLines = readLines(keyPath);
      if (keyLines.join("").trim() === "") error(keyFile, 1, "file is empty");
      else validateAnswerKey(keyFile, keyLines, questions);
    }

    checkLetterSkew(examFile, questions);
    questions.forEach((question) => allQuestions.push({ file: examFile, question }));
  });

  checkSubtopicConsistency(allQuestions);

  const order = (a, b) => (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file));
  warnings.sort(order).forEach((w) => console.log(`${w.file}:${w.line}: warning: ${w.msg}`));
  errors.sort(order).forEach((e) => console.log(`${e.file}:${e.line}: error: ${e.msg}`));

  const questionCount = allQuestions.length;
  console.log(
    `\nChecked ${ids.length} exam(s), ${questionCount} question(s): ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`
  );

  if (errors.length > 0 || (strict && warnings.length > 0)) process.exit(1);
}

main();
