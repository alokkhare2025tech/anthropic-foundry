/**
 * parsers2.mjs — the second wave of sources (2026-09-06 expansion).
 *
 * The first four sources are handled in parsers.mjs. These eight are all
 * shaped differently again: two plain JSON banks, four JS object literals
 * embedded in .js/.html, and two markdown "exam + separate answer key" pairs.
 *
 * Same contract as parsers.mjs — every parser returns:
 *   { source, sourceRef, scenario, domain, task, question, options[], correct,
 *     explanation, whyWrong? }
 *
 * `whyWrong` is new: four of these sources explain each *distractor*, not just
 * the key. That is the single most useful thing for a candidate, so it is
 * carried through rather than flattened into the explanation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { clean } from './parsers.mjs';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const li = (l) => LETTERS.indexOf(String(l).trim().toUpperCase());

/**
 * Read a file with line endings normalised to LF.
 *
 * These repos are cloned on Windows, so git checks them out CRLF. That matters
 * more than it looks: in a JS regex `.` does not match `\r` (it is a line
 * terminator), so every pattern ending in `(.+)$` silently fails on a CRLF
 * line — the option and scenario parsers below returned zero rows until this
 * existed. Normalise once, here, rather than defending in each pattern.
 */
const readText = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n?/g, '\n');

/**
 * Slice a balanced [...] or {...} literal starting at `marker` and evaluate it.
 * The payloads are pure data, so a bare Function is enough — but we still walk
 * the source respecting strings and comments so a brace inside a question stem
 * cannot end the slice early.
 */
export function sliceLiteral(raw, marker) {
  const start = raw.indexOf(marker);
  if (start < 0) return null;
  let open = start + marker.length - 1;
  while (open < raw.length && raw[open] !== '[' && raw[open] !== '{') open++;

  let depth = 0;
  let inStr = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = open; i < raw.length; i++) {
    const c = raw[i];
    const prev = raw[i - 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '/' && prev === '*') blockComment = false; continue; }
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && raw[i + 1] === '/') { lineComment = true; continue; }
    if (c === '/' && raw[i + 1] === '*') { blockComment = true; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) {
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${raw.slice(open, i + 1)});`)();
      }
    }
  }
  return null;
}

const DOMAIN_BY_NAME = (s = '') => {
  const t = s.toLowerCase();
  if (/agentic|orchestrat/.test(t)) return 1;
  if (/tool|mcp/.test(t)) return 2;
  if (/claude code|workflow|configur/.test(t)) return 3;
  if (/prompt|structured|output/.test(t)) return 4;
  if (/context|reliabil/.test(t)) return 5;
  return null;
};

const dom = (id, title) => (id ? { id, title: title || '' } : null);

/* ══ 1. Amey-Thakur — question-bank.json (all four certs in one file) ══════ */

export function parseAmey(file, examKey = 'architect-foundations') {
  const data = JSON.parse(readText(file));
  const out = [];
  const dropped = [];

  for (const q of data.questions) {
    if (q.exam !== examKey) continue;
    const letters = Object.keys(q.options || {}).sort();
    const options = letters.map((l) => clean(q.options[l]));
    const correct = letters.indexOf(String(q.answer).trim().toUpperCase());
    if (options.length < 2 || correct < 0) { dropped.push(q.id); continue; }

    out.push({
      source: 'amey-thakur',
      sourceRef: q.id.replace(`${examKey}-`, ''),
      scenario: q.scenario ? clean(q.scenario) : null,
      domain: dom(DOMAIN_BY_NAME(q.domain), q.domain),
      task: null,
      question: clean(q.question),
      options,
      correct,
      explanation: clean(q.rationale || ''),
    });
  }
  return { questions: out, dropped };
}

/* ══ 2. kamiimeteor/cca-f-dojo — bilingual; structure in one file, English in two ══ */

const DOJO_SCENARIOS = {
  cs: 'Customer Support Agent',
  cc: 'Code Generation with Claude Code',
  ma: 'Multi-Agent Research System',
  dt: 'Developer Productivity',
  ci: 'CI/CD Integration',
  se: 'Structured Data Extraction',
  gen: 'General',
};

/**
 * questions.js holds the authoritative structure (ids, domain, task, answer
 * index, multi-select flag). content.en.*.js overlays English text onto the
 * same ids. Chinese-only items are skipped rather than shipped untranslated.
 */
export function parseDojo(structureFile, englishFiles) {
  const structure = sliceLiteral(readText(structureFile), 'const QUESTIONS =');
  if (!structure) return { questions: [], dropped: ['no-QUESTIONS-array'] };

  const en = {};
  for (const f of englishFiles) {
    const raw = readText(f);
    // Files are `Object.assign(CONTENT_EN.questions, { q001:{...}, ... })`
    const obj = sliceLiteral(raw, 'Object.assign(CONTENT_EN.questions,');
    if (obj) Object.assign(en, obj);
  }

  const out = [];
  const dropped = [];

  for (const q of structure) {
    const t = en[q.id];
    if (!t || !t.q || !Array.isArray(t.o)) { dropped.push(q.id); continue; }

    const options = t.o.map(clean);
    const multi = q.multi === true;
    const correct = multi
      ? (Array.isArray(q.a) ? q.a : [q.a])
      : (typeof q.a === 'number' ? q.a : -1);

    if (!multi && (correct < 0 || correct >= options.length)) { dropped.push(q.id); continue; }
    if (multi && (!Array.isArray(correct) || correct.some((i) => i < 0 || i >= options.length))) {
      dropped.push(q.id);
      continue;
    }

    const whyWrong = {};
    for (const [k, v] of Object.entries(t.w || {})) whyWrong[k] = clean(v);

    out.push({
      source: 'cca-f-dojo',
      sourceRef: q.id,
      scenario: DOJO_SCENARIOS[q.sc] || null,
      domain: dom(Number(String(q.d).replace('d', '')) || null, ''),
      task: q.s ? { id: q.s, title: '' } : null,
      question: clean(t.q),
      options,
      correct,
      multi,
      difficulty: q.diff || null,
      explanation: clean(t.e || ''),
      whyWrong,
    });
  }
  return { questions: out, dropped };
}

/* ══ 3. mominurr/cca-f-mock-exam — const QUESTION_BANK ═════════════════════ */

export function parseMominurr(file) {
  const data = sliceLiteral(readText(file), 'const QUESTION_BANK =');
  if (!data) return { questions: [], dropped: ['no-bank'] };

  const out = [];
  const dropped = [];
  for (const q of data) {
    const options = (q.options || []).map((o) => clean(o.text ?? o));
    const correct = li(q.correctAnswer);
    if (options.length < 2 || correct < 0 || correct >= options.length) { dropped.push(q.id); continue; }

    const whyWrong = {};
    for (const [k, v] of Object.entries(q.wrongAnswerExplanations || {})) {
      const idx = li(k);
      if (idx >= 0) whyWrong[idx] = clean(v);
    }

    out.push({
      source: 'mominurr-mock',
      sourceRef: q.id,
      scenario: null,
      domain: dom(DOMAIN_BY_NAME(q.domain), q.domain),
      task: null,
      question: clean(q.question),
      options,
      correct,
      difficulty: q.difficulty || null,
      explanation: clean(q.explanation || ''),
      whyWrong,
    });
  }
  return { questions: out, dropped };
}

/* ══ 4. timothywarner-org — practice-questions.json ════════════════════════ */

export function parseTimWarner(file) {
  const data = JSON.parse(readText(file));
  const out = [];
  const dropped = [];

  for (const q of data) {
    const options = (q.options || []).map((o) => clean(o.text));
    const correct = (q.options || []).findIndex((o) => o.correct === true);
    if (options.length < 2 || correct < 0) { dropped.push(q.n); continue; }

    // `situation` carries the scenario prose; `question` is the short stem.
    const stem = [q.situation, q.question].filter(Boolean).map(clean).join(' ');

    out.push({
      source: 'tim-warner',
      sourceRef: `Q${q.n}`,
      scenario: q.scenario ? clean(q.scenario) : null,
      domain: null,
      task: null,
      question: stem,
      options,
      correct,
      explanation: clean(q.rationale || q.explanation || ''),
    });
  }
  return { questions: out, dropped };
}

/* ══ 5. pankajarm/cca-f-game — window.BANK, keyed by "floor" ═══════════════ */

export function parsePankajarm(file) {
  const data = sliceLiteral(readText(file), 'window.BANK =');
  if (!data) return { questions: [], dropped: ['no-bank'] };

  const out = [];
  const dropped = [];

  for (const [floor, items] of Object.entries(data)) {
    items.forEach((q, i) => {
      const options = (q.options || q.o || []).map(clean);
      const correct = typeof q.correct === 'number' ? q.correct : li(q.correct ?? q.a);
      if (options.length < 2 || correct < 0 || correct >= options.length) {
        dropped.push(`${floor}-${i}`);
        return;
      }
      // `tags` carries the domain, e.g. ["d1","agentic-loop"].
      const tags = Array.isArray(q.tags) ? q.tags : [];
      const dTag = tags.find((t) => /^d[1-5]$/i.test(t));

      out.push({
        source: 'architects-ascent',
        sourceRef: `${floor}-${i + 1}`,
        scenario: q.sc ? clean(q.sc) : null,
        domain: dTag
          ? dom(Number(dTag.slice(1)), '')
          : dom(DOMAIN_BY_NAME(tags.join(' ') || q.domain || ''), ''),
        task: null,
        question: clean(q.q),
        options,
        correct,
        difficulty: q.difficulty ?? null,
        explanation: clean(q.explanation || q.e || ''),
        hint: q.hint ? clean(q.hint) : null,
      });
    });
  }
  return { questions: out, dropped };
}

/* ══ 6. shourabhmodak — const QUESTIONS in an HTML simulator ═══════════════ */

export function parseShourabh(file) {
  const data = sliceLiteral(readText(file), 'const QUESTIONS =');
  if (!data) return { questions: [], dropped: ['no-bank'] };

  const out = [];
  const dropped = [];
  data.forEach((q, i) => {
    const options = (q.options || []).map(clean);
    if (options.length < 2 || typeof q.correct !== 'number') { dropped.push(i); return; }
    // Some items attach a code block to the stem; keep it, it is the question.
    const stem = q.code ? `${clean(q.text)}\n\n${q.code.trim()}` : clean(q.text);
    out.push({
      source: 'shourabh-simulator',
      sourceRef: `S${i + 1}`,
      scenario: null,
      domain: dom(DOMAIN_BY_NAME(q.domain || ''), q.domain || ''),
      task: null,
      question: stem,
      options,
      correct: q.correct,
      explanation: clean(q.explanation || q.rationale || ''),
    });
  });
  return { questions: out, dropped };
}

/* ══ 7. olgun-yilmaz — exam.md + answer-key.md pairs ═══════════════════════ */

export function parseOlgun(rootDir) {
  const out = [];
  const dropped = [];
  if (!fs.existsSync(rootDir)) return { questions: out, dropped: ['missing-dir'] };

  for (const set of fs.readdirSync(rootDir)) {
    const dir = path.join(rootDir, set);
    const examFile = path.join(dir, 'exam.md');
    const keyFile = path.join(dir, 'answer-key.md');
    if (!fs.existsSync(examFile) || !fs.existsSync(keyFile)) continue;

    // ── answer key: "## Q3" → Correct / Explanation / Why-A..D
    const keys = {};
    for (const block of readText(keyFile).split(/\n(?=## Q\d+)/)) {
      const m = block.match(/^## Q(\d+)/);
      if (!m) continue;
      const correct = block.match(/^Correct:\s*([A-F])/m);
      if (!correct) continue;
      const whyWrong = {};
      for (const w of block.matchAll(/^Why-([A-F]):\s*(.+)$/gm)) {
        const idx = li(w[1]);
        if (idx >= 0) whyWrong[idx] = clean(w[2]);
      }
      keys[Number(m[1])] = {
        correct: li(correct[1]),
        explanation: clean((block.match(/^Explanation:\s*(.+)$/m) || [, ''])[1]),
        whyWrong,
      };
    }

    // ── exam: "## Q3" → metadata lines, stem prose, then "A) …" options
    for (const block of readText(examFile).split(/\n(?=## Q\d+)/)) {
      const m = block.match(/^## Q(\d+)/);
      if (!m) continue;
      const n = Number(m[1]);
      const key = keys[n];
      if (!key) { dropped.push(`${set}-Q${n}`); continue; }

      const domainLine = block.match(/^Domain:\s*(\d)\.\s*(.+)$/m);
      const subtopic = block.match(/^Subtopic:\s*([\d.]+)\s*(.*)$/m);
      const scenario = block.match(/^Scenario:\s*(.+)$/m);

      const options = [];
      const stem = [];
      for (const line of block.split('\n').slice(1)) {
        const om = line.match(/^([A-F])\)\s*(.+)$/);
        if (om) { options[li(om[1])] = clean(om[2]); continue; }
        if (options.length) continue; // trailing prose after options
        if (/^(Domain|Subtopic|Scenario|Type|Difficulty):/.test(line)) continue;
        stem.push(line);
      }

      if (options.length < 2 || options.some((o) => !o) || key.correct < 0) {
        dropped.push(`${set}-Q${n}`);
        continue;
      }

      out.push({
        source: 'olgun-generated',
        sourceRef: `E${set}-Q${n}`,
        scenario: scenario ? clean(scenario[1]) : null,
        domain: domainLine ? dom(Number(domainLine[1]), domainLine[2]) : null,
        task: subtopic ? { id: subtopic[1], title: clean(subtopic[2] || '') } : null,
        question: clean(stem.join(' ')),
        options,
        correct: key.correct,
        explanation: key.explanation,
        whyWrong: key.whyWrong,
      });
    }
  }
  return { questions: out, dropped };
}

/* ══ 8. utkarsh1agarwal — six mock exams, questions and answers in separate files ══ */

export function parseUtkarsh(dir) {
  const out = [];
  const dropped = [];

  for (let n = 1; n <= 6; n++) {
    const qFile = path.join(dir, `exam-${n}-questions.md`);
    const aFile = path.join(dir, `exam-${n}-answers.md`);
    if (!fs.existsSync(qFile) || !fs.existsSync(aFile)) continue;

    // ── answers: "**Q1. Answer: B** *(D1)* — rationale"
    //   exam-2/3 instead use a compact table: "| 1 | B | D1 |"
    const answers = {};
    const aRaw = readText(aFile);
    for (const m of aRaw.matchAll(/\*\*Q?(\d+)\.\s*Answers?:\s*([A-F](?:\s*(?:,|and|\+)\s*[A-F])*)\*\*\s*(?:\*\(([^)]*)\)\*)?\s*(?:—|-)?\s*(.*)/g)) {
      answers[Number(m[1])] = {
        letters: m[2].split(/[^A-F]+/).filter(Boolean),
        domain: m[3] || '',
        rationale: clean(m[4] || ''),
      };
    }
    for (const m of aRaw.matchAll(/^\|\s*(\d+)\s*\|\s*([A-F](?:[,\s+]+[A-F])*)\s*\|\s*([^|]*)\|/gm)) {
      const num = Number(m[1]);
      if (answers[num]) continue;
      answers[num] = { letters: m[2].split(/[^A-F]+/).filter(Boolean), domain: m[3] || '', rationale: '' };
    }

    // ── questions: "## Scenario 1: …" then "**Q1.** stem" then "- **A)** …"
    const qRaw = readText(qFile);
    let scenario = null;
    let buf = null;

    const flush = () => {
      if (!buf) return;
      const a = answers[buf.n];
      const options = buf.options;
      if (!a || options.length < 2 || options.some((o) => !o)) { dropped.push(`E${n}-Q${buf.n}`); buf = null; return; }
      const idx = a.letters.map(li).filter((i) => i >= 0 && i < options.length);
      if (!idx.length) { dropped.push(`E${n}-Q${buf.n}`); buf = null; return; }

      out.push({
        source: 'utkarsh-mocks',
        sourceRef: `E${n}-Q${buf.n}`,
        scenario,
        domain: dom(Number((a.domain.match(/D(\d)/) || [])[1]) || null, ''),
        task: null,
        question: clean(buf.stem.join(' ')),
        options,
        correct: idx.length > 1 ? idx : idx[0],
        multi: idx.length > 1,
        explanation: a.rationale,
      });
      buf = null;
    };

    for (const line of qRaw.split('\n')) {
      const sm = line.match(/^##\s+Scenario\s+\d+:\s*(.+)$/);
      if (sm) { flush(); scenario = clean(sm[1]); continue; }

      const qm = line.match(/^\*\*Q?(\d+)\.\*\*\s*(.*)$/);
      if (qm) { flush(); buf = { n: Number(qm[1]), stem: [qm[2]], options: [] }; continue; }
      if (!buf) continue;

      const om = line.match(/^[-*]?\s*\*\*([A-F])\)\*\*\s*(.+)$/) || line.match(/^[-*]\s*([A-F])\)\s*(.+)$/);
      if (om) { buf.options[li(om[1])] = clean(om[2]); continue; }
      if (!buf.options.length) buf.stem.push(line);
    }
    flush();
  }
  return { questions: out, dropped };
}
