// Shared constants: domain taxonomy/weights, scoring config, fetch base path,
// and storage keys. No dependencies — safe to import from anywhere.

export var DOMAIN_META = {
  1: { name: "Agentic Architecture & Orchestration", weight: 27, color: "#5b9bd5" },
  2: { name: "Tool Design & MCP Integration", weight: 18, color: "#5fb488" },
  3: { name: "Claude Code Configuration & Workflows", weight: 20, color: "#a78bfa" },
  4: { name: "Prompt Engineering & Structured Output", weight: 20, color: "#d6a154" },
  5: { name: "Context Management & Reliability", weight: 15, color: "#d16a5a" }
};

export var PASS_FRACTION = 0.72;

// index.html lives in ExamGenerator/ExamSimulator/, so the data folder
// (ExamGenerator/GeneratedExams/) is one directory up.
export var BASE = "../GeneratedExams/";

export var THEME_KEY = "examgen-theme";

// File System Access API handle store (IndexedDB).
export var FS_DB_NAME = "examgen-fs";
export var FS_STORE_NAME = "handles";
export var FS_ROOT_KEY = "genExamsDir";
