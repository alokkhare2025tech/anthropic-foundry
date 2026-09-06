# Exam blueprint — what CCAR-F actually tests

Distilled from all eight sources, then checked against the 211-question bank. If you read
one file in this repo before sitting the exam, read this one.

---

## The format

60 scenario-based questions · 120 minutes · scaled 100–1,000 · **pass at 720** (~69%) ·
Pearson VUE · $125 USD · credential valid 12 months · registration via
`anthropic.skilljar.com`.

Four scenarios are drawn at random from a bank of six. Every question is framed inside one
of them, so you are never asked "what does `tool_choice` do" — you are asked "given *this*
production symptom, what do you change." Unanswered questions score as incorrect and there
is no guessing penalty: answer everything.

### The six scenarios

1. **Customer Support Resolution Agent** — Agent SDK, custom MCP tools (`get_customer`,
   `lookup_order`, `process_refund`, `escalate_to_human`), target 80% first-contact
   resolution. Tests tool ordering, escalation calibration, ambiguity.
2. **Code Generation with Claude Code** — CLAUDE.md, plan mode, slash commands, rules.
3. **Multi-Agent Research System** — coordinator delegating to web-search, document-
   analysis, synthesis and report subagents. Tests decomposition, context passing,
   citations, error propagation.
4. **Developer Productivity with Claude** — built-in tools on unfamiliar codebases,
   MCP servers, context budget under exploration.
5. **Claude Code for CI/CD** — headless `--print` mode, structured output, batch
   processing, actionable review feedback.
6. **Structured Data Extraction** — JSON schemas, validation loops, human review routing.

---

## The five domains

| # | Domain | Weight | One-line test |
|---|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27% | *Who should have decided this, and did they?* |
| 2 | Tool Design & MCP Integration | 18% | *Is the tool's contract doing the work, or is the prompt?* |
| 3 | Claude Code Configuration & Workflows | 20% | *Which config file, at which scope, loaded when?* |
| 4 | Prompt Engineering & Structured Output | 20% | *Are the criteria explicit, and is the output shape enforced?* |
| 5 | Context Management & Reliability | 15% | *What survives the handoff, and what happens when it fails?* |

Domain 1 is more than a quarter of the exam and its ideas reappear as distractors in the
other four. Study it first and study it hardest.

---

## The nine principles that decide most questions

Almost every item in the bank resolves to one of these. When a question feels ambiguous,
find which principle is in play.

### 1. Deterministic beats probabilistic when the stakes are real

Prompt instructions and few-shot examples land somewhere around 95–99%. If the remaining
1–5% means an unauthorised refund, a closed account or a leaked credential, only
**code-level enforcement** — a hook, a precondition gate, a permission boundary — is an
acceptable answer. "Strengthen the system prompt" is the single most common wrong answer on
this exam.

The inverse also holds: when the failure is cosmetic or low-stakes, reaching for a hook is
over-engineering, and the prompt fix wins.

### 2. Fix the failure at its origin, not downstream

If a coordinator decomposed a topic too narrowly, the bug is in the coordinator — not in
the synthesis agent that faithfully summarised what it was given, and not in a
deduplication pass bolted on afterwards. Trace the symptom back through the logs to the
component that made the decision. Answers that add a cleanup stage after a bad upstream
decision are wrong even when they'd technically work: they burn tokens on work that was
already wasted.

### 3. The simplest reliable architecture wins

Ranked, cheapest first: better tool description → few-shot targeted at the failure →
structured output enforcement → a hook → a new subagent → a new agent tier. Take the first
rung that actually fixes the root cause. "Deploy a routing classifier", "train a model on
historical data" and "merge the agents" are usually distractors selling complexity for a
problem a description edit would solve.

### 4. Tool descriptions are the model's selection mechanism

When the model picks the wrong tool, the first move is nearly always expanding the tool
**descriptions** — input formats, worked examples, and explicit "use when / don't use when"
boundaries. Two tools described as "analyzes X and extracts key information" will be
confused, forever, no matter what the system prompt says. Fix the contract, not the prose
around it.

### 5. Explicit criteria beat adjectives; self-reported confidence is not a signal

"Check that comments are accurate" produces inconsistent results because *accurate* is
undefined. Enumerate what counts. Likewise, asking the model to rate its own confidence
1–10 and escalating below a threshold is a recurring wrong answer — models are confidently
wrong. Escalate on **explicit, checkable criteria** (policy exception, refund over $X,
conflicting sources, missing verification) instead.

### 6. Few-shot should target the ambiguous cases, with rationale

Four to six examples aimed at exactly the scenarios that fail, each explaining *why* this
choice over the plausible alternative, beat fifteen examples of obvious cases. Grouping
examples by tool teaches the categories; interleaving ambiguous ones teaches the decision.

### 7. Structure survives handoffs; prose does not

Claim–source mappings, error states, partial results and metadata must cross agent
boundaries as **structured data**. Concatenating subagent outputs into one text blob loses
provenance and triggers lost-in-the-middle: with ~75K tokens of aggregated input, models
reliably cite the first ~15K and last ~10K and drop the middle. The fix is upstream
distillation, not a bigger context window and not "tell it to re-read the middle."

### 8. Errors must propagate with enough detail to decide

"Failed" is useless. A subagent should return *which* sources succeeded, which returned
zero results, which timed out, and whether each is retryable — so the coordinator can
retry, skip or degrade. Routine, recoverable errors should be handled *inside* the
subagent; only decisions the coordinator alone can make should reach it. And partial
results are usually worth keeping and labelling, not discarding.

### 9. Configuration has a scope and a precedence

- `.claude/commands/` in the repo — team slash commands, version-controlled.
- `~/.claude/commands/` — personal only.
- `CLAUDE.md` — always-loaded instructions; hierarchical, nearest wins.
- `.claude/rules/` with YAML frontmatter and glob patterns — conventions loaded
  **conditionally** by file path. The right answer whenever conventions differ by area and
  the relevant files are scattered.
- `.claude/skills/` — on-demand, multi-step workflows the model invokes when relevant.
- Hooks (`PreToolUse` / `PostToolUse`) — deterministic interception. `PostToolUse` is the
  standard answer for normalising output from third-party MCP servers you cannot modify.
- Plan mode — for large, multi-file, architecture-shaped changes where the approach isn't
  known yet. Not for small well-specified edits.

---

## Sharp facts worth memorising

- Loop control reads `stop_reason`: `tool_use` → continue, `end_turn` → stop. Not text
  parsing, not a fixed iteration cap.
- A coordinator can only spawn subagents if `"Task"` is in its `allowedTools`.
- Parallel subagents = **multiple `Task` calls emitted in one response**. Sequential calls
  are serial latency for nothing.
- Message Batches API: ~50% cheaper, up to 24h, poll-based → correct only for async work
  (overnight deep analysis). Never for anything blocking a merge.
- Headless Claude Code is `--print` / `-p`; a bare `claude "…"` in CI hangs waiting for
  interactive input. `--output-format json` is what makes findings machine-postable.
- MCP transports: `stdio` for local servers, `SSE` for remote.
- Keep the coordinator as the central hub — direct subagent-to-subagent messaging destroys
  observability and the ability to re-delegate.
- Re-delegation should be **targeted**: re-invoke with only the missing work plus completed
  findings as context. Don't re-run what already succeeded.

---

## A four-session study plan

1. **Session 1 — Domain 1 (54 questions here).** The heaviest domain and the source of
   distractors everywhere else. Read `sources/dnacenta/domains/d1-agentic-architecture.md`
   first, then drill.
2. **Session 2 — Domains 2 and 3 (77 questions).** Tool contracts and Claude Code config.
   These are the most fact-heavy and the most learnable in an evening.
3. **Session 3 — Domains 4 and 5 (80 questions).** Prompting, structured output, context,
   reliability. Pair with `sources/hamza-farooq/cheat-sheet/domain4.md` and `domain5.md`.
4. **Session 4 — Timed mock.** 60 questions, 120 minutes, no explanations until the end.
   Score yourself; anything under 72% means go back to the weakest domain rather than
   re-drilling the whole bank.

The single highest-yield habit: for every question you get wrong, write down *which of the
nine principles above* you failed to apply. The exam has far fewer distinct ideas than it
has questions.
