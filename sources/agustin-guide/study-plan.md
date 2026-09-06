# CCA-F — A ~20-Day Study Plan (Template)

A structured, fast-track plan to prepare for the **Claude Certified Architect – Foundations** exam. Built around ~115 hours over 20 days (≈6h/day). Adapt the pace to your own timeline — the structure matters more than the exact dates.

---

## Non-Negotiables

1. **Hit a high practice-exam score before booking the real one.** Aim well above the 720/1000 pass line on fresh practice material.
2. **Agent SDK hands-on is the critical gap for most people.** No shortcuts — build real code, don't just read docs.
3. **Complete all preparation exercises from the official Exam Guide.** The FAQ is explicit: skipping them makes failure likely.
4. **Prepare all 6 exam scenarios** (the exam picks 4 at random).

---

## Exam Facts

- **Level:** advanced — Solution Architect persona
- **Format:** 60 scenario-based multiple choice, 1 correct of 4
- **Passing:** 720/1000 (scaled)
- **Proctor:** ProctorFree
- **Access:** via Anthropic's certification portal (Skilljar)

*Verify current details against the official exam guide before booking.*

---

## Domain Weightings

| Domain | % | Typical baseline | Focus |
|---|---|---|---|
| **D1 Agentic Architecture & Orchestration** | 27% | LOW | HIGHEST |
| **D2 Tool Design & MCP Integration** | 18% | MODERATE | HIGH |
| **D3 Claude Code Configuration & Workflows** | 20% | HIGH | LOW — validate only |
| **D4 Prompt Engineering & Structured Output** | 20% | MODERATE | MODERATE |
| **D5 Context Management & Reliability** | 15% | MODERATE | MODERATE |

> Adjust "baseline/focus" to your own strengths. The point: spend the most time on the highest-weight domain where you're weakest (for most people, D1).

---

## The 6 Scenarios — Must Master All

1. **Customer Support Resolution Agent** — MCP tools, escalation (D1/D2/D5)
2. **Code Generation with Claude Code** — CLAUDE.md, slash commands, plan mode (D3/D5)
3. **Multi-Agent Research System** — coordinator + subagents (D1/D2/D5)
4. **Developer Productivity with Claude** — built-in tools + MCP (D2/D3/D1)
5. **Claude Code for CI/CD** — `-p`, JSON output, PR review (D3/D4)
6. **Structured Data Extraction** — JSON schemas, batch API, validation (D4/D5)

---

## Day-by-Day Plan

### Week 1 — Foundation + Agent SDK Hands-On

**Day 1 (6h) — Setup & onboarding**
- [ ] Register on the certification portal, confirm access to the CCA-F track
- [ ] Try the practice-exam URL — if no access, contact academy support
- [ ] Read the CCA-F Exam Guide fully; mark unclear items
- [ ] Skim the relevant Anthropic Academy courses:
  - Building with the Claude API (skim)
  - Introduction to MCP (focus on `isError`, resources)
  - Claude Code in Action (validate config-hierarchy section)

**Day 2 (8h) — Academy + Agent SDK Quickstart**
- [ ] Complete the agent-focused Academy courses:
  - Introduction to Agent Skills
  - **Introduction to Subagents — full pace** (critical for D1)
- [ ] **Agent SDK Quickstart (Python)** — run end-to-end: `platform.claude.com/docs/en/agent-sdk/quickstart`
  - Set up a venv, install `claude-agent-sdk`, run the sample
  - Verify you see tool_use/tool_result cycles in output

**Day 3 (8h) — Agent SDK Deep Dive**
- [ ] Read + take notes on:
  - The agent loop (`stop_reason: "tool_use"` vs `"end_turn"`)
  - Custom tools
  - Connecting MCP servers
  - Sessions (`--resume`, `fork_session`)
  - Hooks (`PostToolUse`, tool-call interception)
  - Subagents (`Task` tool, `allowedTools`, isolated context)
  - Structured outputs
- [ ] **Mini-build #1:** a tiny agent with 2 custom tools (`get_weather`, `get_time`); verify loop termination on `end_turn`

**Day 4 (6h) — Exercise 1, Part 1**
- [ ] **Exercise 1: Multi-Tool Agent with Escalation**
  - Define 3-4 MCP tools with detailed descriptions (include 2 with similar functionality to test selection)
  - Implement the agentic loop inspecting `stop_reason`
  - Add structured error responses: `errorCategory`, `isRetryable`, human-readable message

**Day 5 (6h) — Exercise 1, Part 2**
- [ ] **Finish Exercise 1:**
  - Add a programmatic hook intercepting tool calls (e.g., block `process_refund` above a threshold)
  - Test multi-concern messages (multiple issues in one request) → verify decomposition
  - Test all 4 error types (transient/validation/business/permission)

**Day 6 (6h) — Exercise 4, Part 1**
- [ ] **Exercise 4: Multi-Agent Research Pipeline**
  - Coordinator with `allowedTools` including `"Task"`
  - 2 subagents: web search + document analysis (stub data is fine)
  - Each subagent receives research findings in the prompt directly (no automatic inheritance)

**Day 7 (6h) — Exercise 4, Part 2**
- [ ] **Finish Exercise 4:**
  - Parallel subagent execution: multiple `Task` calls in ONE coordinator response
  - Structured output separating content from metadata (source URLs, dates, excerpts)
  - Error propagation: simulate a subagent timeout → verify the coordinator receives structured error context (failure type, attempted query, partial results)
  - Test conflicting sources → verify synthesis preserves both with attribution

---

### Week 2 — Remaining Exercises + Domain Deep Dive

**Day 8 (6h) — Exercise 2**
- [ ] **Exercise 2: Claude Code Team Workflow Config**
  - Project-level CLAUDE.md with universal standards
  - `.claude/rules/` files with YAML `paths:` globs (e.g., `**/*.test.tsx`)
  - Project-scoped skill with `context: fork` + `allowed-tools`
  - MCP server in `.mcp.json` with `${ENV_VAR}` expansion
  - Personal experimental MCP in `~/.claude.json`
  - Test plan mode vs direct execution on 3 complexity levels

**Day 9 (8h) — Exercise 3 + D4 Deep Dive**
- [ ] **Exercise 3: Structured Data Extraction Pipeline**
  - JSON schema with required/optional, nullable fields, enum with `"other"` + detail
  - `tool_use` + `tool_choice: "any"` or forced
  - Validation-retry loop (send doc + failed extraction + validation error)
  - Few-shot examples for varied formats (inline citations vs bibliographies)
  - Message Batches API: 100 docs, `custom_id` correlation, handle failures
  - Human-review routing with field-level confidence scores

**Day 10 (8h) — D1 + D2 Deep Dive**
- [ ] Re-read Domain 1 task statements (1.1-1.7) — write one-liner for each
- [ ] Re-read Domain 2 task statements (2.1-2.5) — write one-liner for each
- [ ] Drill the Exam Guide sample questions for Scenarios 1 & 3
- [ ] For each wrong answer, identify WHICH task statement it tested

**Day 11 (6h) — D3 Validation + D5 Deep Dive**
- [ ] D3 task statements (3.1-3.6) — quick-read
- [ ] D5 task statements (5.1-5.6) — careful read:
  - Progressive summarization risks
  - Lost in the middle
  - Scratchpad files
  - `/compact`
  - Confidence calibration
  - Claim-source mappings, temporal data
- [ ] Drill more sample questions

**Day 12 (6h) — D4 Review + Cheat Sheet**
- [ ] D4 task statements (4.1-4.6) — careful read
- [ ] Build a one-pager cheat sheet covering:
  - Agent SDK quick reference (`stop_reason` values, `allowedTools`, `Task`, hooks, sessions)
  - MCP error format
  - Claude Code config hierarchy + `.claude/rules/` glob syntax
  - `tool_choice` options
  - Batch API constraints (no multi-turn tool calling!)
  - Context-management patterns
- [ ] Re-read all sample questions + their explanations

**Day 13 (6h) — Mock drill + In-Scope review**
- [ ] Custom drill: 20 questions you create covering all 5 domains (weighted)
- [ ] Re-read the Appendix In-Scope Topics list — confirm you can explain each
- [ ] Re-read Out-of-Scope Topics — don't waste time studying these

**Day 14 (6h) — Weak-area fix day**
- [ ] Review your custom-drill results
- [ ] For any topic <80% confidence, re-read the Task Statement + related exercise code
- [ ] Verify all exercises actually run end-to-end

---

### Week 3 — Practice Exam + Real Exam

**Day 15 (6h) — Final theory review**
- [ ] Re-read all 6 scenario descriptions
- [ ] Re-read the Preparation Exercises section — confirm your implementations match
- [ ] Check ProctorFree setup: camera, microphone, ID, quiet room

**Day 16 (6h) — PRACTICE EXAM**
- [ ] Take a fresh practice exam under timed conditions
- [ ] Set a high target (well above pass line)
- [ ] If you fall short: pause, don't book the real exam, add 2-3 days of review
- [ ] Review every answer, even correct ones. Classify errors: unknown / misunderstood / misread

**Day 17 (6h) — Practice-exam deep review**
- [ ] For every wrong answer: identify the task statement, re-read, re-do the exercise if needed
- [ ] For every guessed-right answer: same treatment
- [ ] Write "lessons learned" notes — patterns you missed

**Day 18 (6h) — Targeted drilling**
- [ ] Drill weak domains specifically
- [ ] Re-do any exercise that exposed a gap
- [ ] Re-read the cheat sheet

**Day 19 (3h) — Light review**
- [ ] Re-read the cheat sheet only
- [ ] Re-read all 6 scenario descriptions
- [ ] No new content. Rest.

**Day 20 — EXAM DAY**
- [ ] Morning session (peak alertness)
- [ ] Two-pass strategy: confident first, flag hard, return
- [ ] Read every question twice — misread = lost point

---

## Key Concepts to Memorize

### Agent SDK
- **Loop termination:** `stop_reason == "tool_use"` → continue; `"end_turn"` → stop. Never parse text content or use iteration caps as the primary stopping mechanism.
- **Subagent spawning:** `allowedTools` MUST include `"Task"`. Subagents have **isolated context** — no automatic inheritance.
- **Parallel subagents:** multiple `Task` calls in ONE coordinator response (not across turns).
- **`fork_session`:** independent branches from a shared baseline.
- **Hooks for deterministic compliance:** `PostToolUse` intercepts before the model sees the result. Use when business rules need GUARANTEED enforcement.

### MCP
- **Tool descriptions = primary selection mechanism.** Fix vague descriptions before adding classifiers.
- **Structured errors:** `isError: true` + `errorCategory` (transient/validation/business/permission) + `isRetryable` bool.
- **`.mcp.json`** (project, team-shared) vs `~/.claude.json` (personal).
- **MCP resources** = content catalogs to avoid exploratory tool calls.

### Claude Code
- **Hierarchy:** `~/.claude/CLAUDE.md` (personal, NOT shared) → project `.claude/CLAUDE.md` → subdirectory `CLAUDE.md`.
- **`.claude/rules/`** with YAML `paths:` globs = conditional rule loading. Better than subdirectory CLAUDE.md when conventions span directories.
- **Slash commands:** `.claude/commands/` (team, version-controlled) vs `~/.claude/commands/` (personal).
- **Skill frontmatter:** `context: fork`, `allowed-tools`, `argument-hint`.
- **CI/CD:** `claude -p "..." --output-format json --json-schema <file>`.
- **Plan mode** for architectural/multi-file; **direct execution** for well-scoped.

### Prompt Engineering
- **`tool_use` + JSON schema** = most reliable structured output, eliminates syntax errors.
- **`tool_choice`:** `"auto"` (may return text), `"any"` (must call a tool), forced (`{"type": "tool", "name": "..."}`).
- **Nullable/optional fields** prevent fabrication. Enum with `"other"` + detail for extensibility.
- **Semantic errors** (wrong sums, misplaced values) are NOT eliminated by tool_use — need retry-with-feedback.
- Few-shot beats instructions for ambiguous scenarios (2-4 examples).

### Batch API
- 50% cost savings, up to 24h window, **NO multi-turn tool calling** in a single request.
- OK for: overnight reports, weekly audits, nightly test generation.
- NOT OK for: blocking pre-merge checks.
- `custom_id` correlates request/response pairs.

### Context Management
- **Lost in the middle:** models process start/end reliably, may omit the middle.
- **Progressive summarization loses precision** — extract facts (dates, IDs, amounts) into a persistent "case facts" block, kept OUTSIDE the summarized history.
- **Independent review instance** > self-review (no shared reasoning context).
- **Multi-pass review:** per-file local + cross-file integration pass (avoids attention dilution).
- **`/compact`** during extended exploration sessions.

---

## Top Exam Traps

| Trap | Correct answer |
|---|---|
| Few-shot vs improve tool descriptions | Fix descriptions first — root cause of tool selection issues |
| Prompts for critical compliance | Use hooks/programmatic prerequisites — prompts are probabilistic |
| More tools for subagent | Scope narrowly; cross-role tools only for high-frequency needs |
| Bigger context window | Doesn't fix attention dilution — split into focused passes |
| Self-reported confidence | Poorly calibrated — agent is wrong-and-confident on hard cases |
| Sentiment-based escalation | Frustration ≠ case complexity — use explicit criteria |
| Consolidate into root CLAUDE.md | Use `.claude/rules/` with globs for cross-directory conventions |
| Route every verification through coordinator | Give subagent a scoped tool for the 80/20 case |
| Terminate on any subagent error | Propagate structured error context |
| Generic error status | Return structured metadata with category + retryable flag |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| One attempt per booking | Hit a high practice score before booking |
| Agent SDK never used programmatically | 3 days hands-on early + Exercise 1 |
| 20 days is tight | Front-load high-weight domains (D1, D2); validate D3 fast |
| Scenarios picked at random | Prepare ALL 6 |
| ProctorFree tech issues | Test setup the day before |
| Burn-out | Keep two lighter days in the schedule — protect them |

---

## Go/No-Go Criteria Before Booking the Exam

- [ ] All preparation exercises built and tested
- [ ] High score on a fresh practice exam
- [ ] Can explain every Task Statement unprompted
- [ ] Cheat sheet fits on 1 page (and is memorized)

---

*Template — adapt freely. See [cheatsheet.md](./cheatsheet.md) for the exam-day reference and [anthropic-refs.md](./anthropic-refs.md) for the multi-agent reading notes.*
