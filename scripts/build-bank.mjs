/**
 * build-bank.mjs — merge every parsed source into data/questions.json.
 *
 * Run: node scripts/build-bank.mjs
 *
 * Dedup rule: two questions are "the same" when the normalised first 140
 * characters of the stem match. The community banks reworded the same official
 * sample questions, so we keep the first occurrence and record the duplicate's
 * origin under `alsoIn` instead of dropping the attribution.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOlivier, parseGist, parseHamza } from './parsers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => path.join(root, 'sources', ...p);

const DOMAINS = JSON.parse(fs.readFileSync(path.join(root, 'data', 'domains.json'), 'utf8'));

/** Keyword fallback so questions with no declared domain still get one. */
function inferDomain(q) {
  if (q.domain) return q.domain.id;
  const t = `${q.question} ${q.options.join(' ')}`.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const d of DOMAINS) {
    let score = 0;
    for (const kw of d.keywords) {
      const hits = t.split(kw.toLowerCase()).length - 1;
      score += hits * (kw.includes(' ') ? 2 : 1);
    }
    if (score > bestScore) { bestScore = score; best = d.id; }
  }
  return bestScore > 0 ? best : 1;
}

const fingerprint = (q) =>
  q.question.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 140);

const batches = [
  parseOlivier(src('olivier-alter', 'Claude Certification Exam.md')),
  parseGist(src('marco-cheng-gist', 'practice-exam.md')),
  parseHamza(src('hamza-farooq', 'practice-exam.html'), 'DOMAINS', 'hamza-practice-exam'),
  parseHamza(src('hamza-farooq', 'quick-quiz.html'), 'QUESTIONS', 'hamza-quick-quiz'),
];

const bySig = new Map();
const stats = {};

for (const batch of batches) {
  for (const q of batch.questions) {
    const label = q.source;
    stats[label] ??= { parsed: 0, unique: 0, duplicate: 0 };
    stats[label].parsed++;

    const sig = fingerprint(q);
    const existing = bySig.get(sig);
    if (existing) {
      existing.alsoIn.push({ source: q.source, ref: q.sourceRef });
      // Prefer the longest explanation across duplicate phrasings.
      if (q.explanation.length > existing.explanation.length) {
        existing.explanation = q.explanation;
      }
      existing.scenario ||= q.scenario;
      stats[label].duplicate++;
      continue;
    }

    bySig.set(sig, { ...q, alsoIn: [] });
    stats[label].unique++;
  }
}

const questions = [...bySig.values()].map((q, i) => {
  const domainId = inferDomain(q);
  const domain = DOMAINS.find((d) => d.id === domainId);
  return {
    id: `Q${String(i + 1).padStart(3, '0')}`,
    domainId,
    domainTitle: domain.title,
    domainWeight: domain.weight,
    task: q.task ? `${q.task.id} ${q.task.title}` : null,
    scenario: q.scenario,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    source: q.source,
    sourceRef: q.sourceRef,
    alsoIn: q.alsoIn,
  };
});

// Sort by domain then id so the bank reads in blueprint order.
questions.sort((a, b) => a.domainId - b.domainId || a.id.localeCompare(b.id));
questions.forEach((q, i) => { q.id = `Q${String(i + 1).padStart(3, '0')}`; });

const perDomain = DOMAINS.map((d) => ({
  id: d.id,
  title: d.title,
  weight: d.weight,
  count: questions.filter((q) => q.domainId === d.id).length,
}));

const bank = {
  meta: {
    name: 'Anthropic Foundry — Claude Certified Architect: Foundations question bank',
    generatedAt: new Date().toISOString().slice(0, 10),
    total: questions.length,
    passingScore: 720,
    scaledRange: [100, 1000],
    officialFormat: '60 scenario-based questions in 120 minutes (Pearson VUE)',
    perDomain,
    sources: stats,
  },
  questions,
};

fs.writeFileSync(path.join(root, 'data', 'questions.json'), JSON.stringify(bank, null, 2));

console.log('parsed per source:');
for (const [k, v] of Object.entries(stats)) {
  console.log(`  ${k.padEnd(22)} parsed=${v.parsed} unique=${v.unique} dup=${v.duplicate}`);
}
console.log('dropped blocks:', batches.map((b) => b.dropped.length).join(', '));
console.log('per domain:', perDomain.map((d) => `D${d.id}=${d.count}`).join(' '));
console.log(`TOTAL ${questions.length} questions -> data/questions.json`);
