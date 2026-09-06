#!/usr/bin/env node
// Regenerates GeneratedExams/manifest.json from the folders actually present on disk,
// so the manifest is a derived index rather than a hand-maintained list.
//
// Usage: node scripts/sync-manifest.js

const fs = require("fs");
const path = require("path");

const GENERATED_EXAMS_DIR = path.join(__dirname, "..", "ExamGenerator", "GeneratedExams");
const MANIFEST_PATH = path.join(GENERATED_EXAMS_DIR, "manifest.json");

function findExamIds() {
  return fs
    .readdirSync(GENERATED_EXAMS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(GENERATED_EXAMS_DIR, id, "exam.md")));
}

function sortIds(ids) {
  const numeric = ids.filter((id) => /^\d+$/.test(id)).sort((a, b) => Number(a) - Number(b));
  const named = ids.filter((id) => !/^\d+$/.test(id) && id !== "_sample").sort();
  const sample = ids.includes("_sample") ? ["_sample"] : [];
  return [...sample, ...named, ...numeric];
}

const ids = sortIds(findExamIds());
// LF, because that is how git stores the file. Writing CRLF here left a Linux checkout
// permanently differing from the blob, so the pre-commit hook saw a change on every run.
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(ids) + "\n");

console.log(`Wrote ${ids.length} id(s) to ${path.relative(process.cwd(), MANIFEST_PATH)}: ${ids.join(", ")}`);
