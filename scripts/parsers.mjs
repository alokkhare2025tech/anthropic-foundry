/**
 * parsers.mjs — turn three differently-shaped community question banks into one schema.
 *
 * Every parser returns an array of:
 *   { source, sourceRef, scenario, domain, task, question, options[4], correct (0-3), explanation }
 *
 * The parsers are deliberately strict: if a block does not yield exactly the
 * expected shape it is dropped and counted, so a silent format drift shows up
 * as a falling question count rather than as garbage in the bank.
 */

import fs from 'node:fs';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Collapse the smart quotes / non-breaking spaces the sources are full of. */
export function clean(s) {
  return String(s)
    .replace(/ /g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, '—')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/<\/?code>/g, '')
    .replace(/<\/?strong>/g, '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(\s*-{3,})+\s*$/, '') // trailing markdown horizontal rules
    .trim();
}

/* ------------------------------------------------------------------ *
 * Source 1 — OlivierAlter: 77 questions, markdown, answers in a table
 * ------------------------------------------------------------------ */

export function parseOlivier(path) {
  const raw = fs.readFileSync(path, 'utf8');
  const out = [];
  const dropped = [];

  // Answer key lives in a 4-column-pairs markdown table at the end.
  const key = {};
  const keySection = raw.slice(raw.indexOf('## Answer Key'));
  for (const line of keySection.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    for (let i = 0; i < cells.length - 1; i++) {
      if (/^\d+$/.test(cells[i]) && /^[A-D]$/.test(cells[i + 1])) {
        key[Number(cells[i])] = cells[i + 1];
      }
    }
  }

  // Domain + task headings so each question can be attributed.
  // We walk the document line by line, tracking the most recent headings.
  const lines = raw.split('\n');
  let domain = null;
  let task = null;
  let buf = null;

  const flush = () => {
    if (!buf) return;
    const parsed = olivierBlock(buf, key);
    if (parsed) out.push({ ...parsed, domain, task });
    else dropped.push(buf.num);
    buf = null;
  };

  for (const line of lines) {
    const dm = line.match(/^##\s+Domain\s+(\d):\s*(.+)$/);
    if (dm) {
      flush();
      domain = { id: Number(dm[1]), title: clean(dm[2]) };
      task = null;
      continue;
    }
    const tm = line.match(/^###\s+Task\s+([\d.]+):\s*(.+)$/);
    if (tm) {
      flush();
      task = { id: tm[1], title: clean(tm[2]) };
      continue;
    }
    const qm = line.match(/^\*\*Q(\d+)\.\*\*\s*(.*)$/);
    if (qm) {
      flush();
      buf = { num: Number(qm[1]), lines: [qm[2]] };
      continue;
    }
    if (buf) buf.lines.push(line);
  }
  flush();

  return { questions: out, dropped };
}

function olivierBlock(buf, key) {
  const text = buf.lines.join('\n');
  // Split at the answer marker.
  const am = text.match(/\*\*Correct Answer:\s*([A-D])\*\*\s*([\s\S]*)/);
  if (!am) return null;
  const before = text.slice(0, am.index);
  const correctLetter = am[1];
  const explanation = clean(am[2].replace(/^---$/gm, ''));

  const opts = [];
  const stemLines = [];
  for (const line of before.split('\n')) {
    const om = line.match(/^([A-D])\)\s*(.+)$/);
    if (om) opts[LETTERS.indexOf(om[1])] = clean(om[2]);
    else if (opts.length === 0) stemLines.push(line);
  }
  if (opts.length !== 4 || opts.some((o) => !o)) return null;

  const correct = LETTERS.indexOf(key[buf.num] || correctLetter);
  if (correct < 0 || correct > 3) return null;

  return {
    source: 'olivier-alter',
    sourceRef: `Q${buf.num}`,
    scenario: null,
    question: clean(stemLines.join(' ')),
    options: opts,
    correct,
    explanation,
  };
}

/* ------------------------------------------------------------------ *
 * Source 2 — mc-marcocheng gist: 60 questions, "[CORRECT]" inline marker
 * ------------------------------------------------------------------ */

export function parseGist(path) {
  const raw = fs.readFileSync(path, 'utf8');
  const out = [];
  const dropped = [];

  // The gist restates its first dozen questions in a second, longer-form pass,
  // so plain "Q<n>" refs would collide. Suffix repeats as Q7b, Q7c, …
  const seen = new Map();

  const blocks = raw.split(/\n(?=## Question\s+\d+)/);
  for (const block of blocks) {
    const hm = block.match(/^## Question\s+(\d+)(?:\s*\(Scenario:\s*([^)]+)\))?/);
    if (!hm) continue;
    const num = Number(hm[1]);
    const scenario = hm[2] ? clean(hm[2]) : null;

    const opts = [];
    let correct = -1;
    const stem = [];
    let seenOpt = false;
    let why = '';

    for (const line of block.split('\n').slice(1)) {
      const wm = line.match(/^\*\*Why\s+([A-D])[:,]?\*\*\s*(.*)$/);
      if (wm) {
        why = clean(wm[2]);
        if (correct < 0) correct = LETTERS.indexOf(wm[1]);
        continue;
      }
      const om = line.match(/^-\s*([A-D])\)\s*(.+)$/);
      if (om) {
        seenOpt = true;
        let body = om[2];
        if (/\[CORRECT\]/.test(body)) correct = LETTERS.indexOf(om[1]);
        opts[LETTERS.indexOf(om[1])] = clean(body.replace(/\*\*\[CORRECT\]\*\*|\[CORRECT\]/g, ''));
        continue;
      }
      // Keep the actual question line ("**What's the cause?**") — only the
      // "Situation:" label itself is noise. clean() drops the bold markers.
      if (!seenOpt) stem.push(line.replace(/^\*\*Situation:\*\*/i, ''));
      else if (why) why += ' ' + line;
    }

    if (opts.length < 2 || opts.some((o) => !o) || correct < 0) {
      dropped.push(num);
      continue;
    }

    const nth = (seen.get(num) || 0) + 1;
    seen.set(num, nth);

    out.push({
      source: 'marco-cheng-gist',
      sourceRef: `Q${num}${nth > 1 ? String.fromCharCode(96 + nth) : ''}`,
      scenario,
      domain: null,
      task: null,
      question: clean(stem.join(' ')),
      options: opts.map(clean),
      correct,
      explanation: clean(why),
    });
  }

  return { questions: out, dropped };
}

/* ------------------------------------------------------------------ *
 * Source 3 — hamzafarooq: questions live in a JS array inside two HTML files
 * ------------------------------------------------------------------ */

/**
 * The HTML files embed `const DOMAINS = [...]` / `const QUIZ = [...]`.
 * Rather than regex the object literals, slice out the literal and eval it in
 * a bare context — the payload is pure data with no identifiers.
 */
export function parseHamza(path, varName, label) {
  const raw = fs.readFileSync(path, 'utf8');
  const start = raw.indexOf(`const ${varName} = [`);
  if (start < 0) return { questions: [], dropped: ['no-array'] };

  const open = raw.indexOf('[', start);
  let depth = 0;
  let end = -1;
  let inStr = null;
  let inComment = false;
  for (let i = open; i < raw.length; i++) {
    const c = raw[i];
    const prev = raw[i - 1];
    if (inComment) {
      if (c === '\n') inComment = false;
      continue;
    }
    if (inStr) {
      if (c === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && raw[i + 1] === '/') { inComment = true; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end < 0) return { questions: [], dropped: ['unbalanced'] };

  // eslint-disable-next-line no-new-func
  const data = Function(`"use strict"; return (${raw.slice(open, end)});`)();

  const out = [];
  const dropped = [];
  const push = (item, domain, idx) => {
    if (!item || !item.q || !Array.isArray(item.opts) || typeof item.correct !== 'number') {
      dropped.push(idx);
      return;
    }
    out.push({
      source: label,
      sourceRef: `${domain ? `D${domain.id}` : 'QQ'}-${idx + 1}`,
      scenario: item.scenario ? clean(item.scenario) : null,
      domain: domain ? { id: domain.id, title: clean(domain.title) } : null,
      task: null,
      question: clean(item.q),
      options: item.opts.map(clean),
      correct: item.correct,
      explanation: clean(item.exp || item.explanation || ''),
    });
  };

  if (varName === 'DOMAINS') {
    data.forEach((d) => (d.qs || []).forEach((q, i) => push(q, d, i)));
  } else {
    data.forEach((q, i) => push(q, null, i));
  }

  return { questions: out, dropped };
}
