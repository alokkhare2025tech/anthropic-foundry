---
name: cert-exam-generator
description: Generate an original Claude Certified Architect – Foundations (CCAR-F) practice exam into an ExamGenerator/GeneratedExams exam-ID folder (exam.md + answer-key.md) and register it in manifest.json. Scenario-based, single-best-answer, real-exam-caliber questions grounded in this repo's Notes and Cheat Sheets. Use when asked to create/generate a new practice exam or add exam questions.
---

# CCAR-F Exam Generator

Author a new practice exam for the **Claude Certified Architect – Foundations** certification, written directly into the repo's exam format so it opens in `ExamGenerator/ExamSimulator/index.html`.

You are writing exam questions that a knowledgeable candidate will study from. The bar is a real certification item: a plausible production scenario, one defensibly-best answer, and three distractors that a half-prepared candidate would seriously consider. If a question can be answered without reading the scenario — because the correct choice is the longest, the most detailed, the most qualified, or the only non-silly one — it has failed and must be rewritten. **The most common way this skill fails is option-length bias: an exam where "always pick the longest choice" scores well is a broken exam, no matter how good the individual scenarios are. See the option-length parity rules in Step 4 and the word-count audit in Step 6 — both are mandatory.**

## When to use

Use this skill when the user asks to create, generate, or add to a CCAR-F practice exam. This skill produces exam content; it does not deliver or grade exams (that's what `ExamSimulator/index.html` does).

## Parameters (read from the conversation)

Take the exam's parameters from what the user has said. **Never assume** a default exam size or domain mix — but equally, never ask about something the user already specified. Ask only for what's actually missing, once, then generate.

When either **count** or **scope** is absent from the conversation, ask for all missing parameters in one concise message so the user can answer them in one pass:

- **count** — how many questions. Required. Offer `20` (short practice exam), `40` (medium-length), `60` (full-length, matching real exam size), and let the user type any other number.
- **scope** — which domains/subtopics to cover, and in what proportion. Offer a weighted spread across all five domains (recommended — proportional to the blueprint weightings below) or a custom domain/subtopic focus. If they pick a custom focus without naming it, ask which domain or subtopic.

If the user already gave both (e.g. *"make me a 30-question exam on D2 and D3"*), ask nothing at all — go straight to generating.
- **id** — the exam folder id. Optional; if not given, choose it per the workflow below.
- **difficulty / theme** — honor any the user states (e.g. "focus on the trickier D1 orchestration cases", "all six scenario families"). Default to real-exam difficulty regardless.

Once count and scope are known, generate without further prompting.

## Step 1 — Ground yourself in the source material (read before drafting)

These files are the distilled substance of the official exam guide and encode the exam's actual answer logic and trap patterns. Read the ones relevant to the requested scope **before** writing any question:

- `Data/exam-details.md` — the official blueprint: domain weightings, and the full description of each of the 6 scenario families (including their specific systems/tools and their primary domains). Scenario narratives must be grounded in these descriptions, not reinvented.
- `Notes/Cheat Sheet/1-The Exam's Core Decision Rule.md` — how to pick the best answer when two look plausible. Note: the real filename uses a curly apostrophe (`1-The Exam’s Core Decision Rule.md`), not a straight one — search the repository (prefer `rg`) rather than copying the literal path.
- `Notes/Cheat Sheet/2- Exam Scenario Map.md` — maps scenario families to their typical questions/domains; use it alongside `Data/exam-details.md` when picking and assigning scenario families (Step 4).
- `Notes/Cheat Sheet/3-If You See This, Choose That.md` — symptom → correct mechanism mappings.
- `Notes/Cheat Sheet/4-Top Wrong-Answer Patterns.md` — the anti-patterns that make good distractors.
- `Notes/Cheat Sheet/5-Out-of-Scope Distractors.md` — topics that are out of scope (use only as distractors, never as the correct answer).
- `Notes/Cheat Sheet/Domains/<domain>.md` and `Notes/Anthropic Certifications/<domain>/<subtopic>.md` — the actual subject matter for each targeted subtopic (1.1–5.6). Use repository search (prefer `rg`) to locate exact filenames; some have typos or trailing spaces.
- `ExamGenerator/GeneratedExams/_sample/exam.md` and `answer-key.md` — the exact output shape you must reproduce.

Every question you write must trace to a specific subtopic in the notes. If you cannot point to the note that justifies the correct answer, do not ship the question.

## Step 2 — Output format contract (the ExamSimulator parser is strict)

Produce exactly two files. Match this shape character-for-character; the viewer parses it with fixed rules, not a general Markdown parser.

**`exam.md`:**

```markdown
# Exam <id>

Title: <short descriptive title>
Total: <N>

## Q1
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.4 Workflow Enforcement & Handoff
Scenario: Large-Scale Codebase Refactoring with Multi-Agent Claude Code

A development team is breaking a legacy Java monolith into microservices with Claude Code's multi-agent features. Specialist subagents are configured through CLAUDE.md, custom hooks enforce lint rules, and agentic delegation patterns coordinate changes across hundreds of files.

A Claude Code agent has spent 30 minutes debugging a failing test suite mid-refactor, trying three different approaches that each modified configuration files. None worked, and its context now holds three sets of conflicting modifications and failed outputs. The developer wants to try a completely different strategy. What session management approach should they use?

A) <choice A>
B) <choice B>
C) <choice C>
D) <choice D>

## Q2
Domain: 5. Context Management & Reliability
Subtopic: 5.1 Managing Conversation Context
Scenario: Multi-Agent Research System

<2-4 sentence scenario narrative paragraph — the concrete situation/system being described, no question in it.>

<The actual question stem — one or more lines, the interrogative call-to-action.>

...
```

Rules:
- First line is `# Exam <id>`. Then a `Title:` line and a `Total:` line equal to the question count.
- Each question block starts with `## Q<n>`, numbered sequentially from 1 with no gaps.
- The `Domain:` line must be `Domain: <n>. <exact domain name>` — the number and name must match the taxonomy below exactly.
- The `Subtopic:` line is `Subtopic: <d.s> <exact subtopic name>` (e.g. `1.4 Workflow Enforcement & Handoff`); it comes immediately after `Domain:`, its `<d.s>` id is the section number shown on every card next to the question, and it is the note the question traces to (Step 1). The parser treats it as optional (falls back to the domain-level label if absent, see `ExamGenerator/README.md`), but this skill must populate it on every question it writes — it's how you prove each question traces to a note.
- The `Scenario:` line is a short scenario-situation title (e.g. `Large-Scale Codebase Refactoring with Multi-Agent Claude Code`) shown as the heading of the scenario reference card; it comes after `Subtopic:`. Likewise optional to the parser but required output from this skill — every generated question must carry one of the 4 chosen scenario families (Step 4).
- After the three meta lines and a blank line, write exactly **two paragraphs**, separated by one blank line — match `_sample/exam.md` exactly, not just in spirit:
  - **Paragraph 1 — the setup.** 1-3 sentences of generic system/organization context: who's building what, with which components, in what general capacity. No specific incident, no numbers, no named failure, no question. This paragraph should be reusable across many different questions for the same scenario family.
  - **Paragraph 2 — the incident + the question, combined in one paragraph.** The concrete complication (specific numbers, a specific failed attempt, a specific disagreement, etc.) followed directly by the question stem in the same paragraph, e.g. "...the other two are barely mentioned. What should they do first?" Do NOT split the incident detail and the question into separate paragraphs, and do NOT let paragraph 2 shrink to a bare one-line question with no incident content of its own — every question must carry its specific, concrete complication in paragraph 2, not have it front-loaded into paragraph 1's generic setup.
- The simulator renders paragraph 2 as the main headline area and paragraph 1 as a separate reference card beneath it (see `scenario.png`-style layout in `ExamSimulator/index.html`). A question fails Step 6 if paragraph 2 is only the question with no incident-specific content.
- Exactly four choices, labeled `A)`, `B)`, `C)`, `D)`, one per line, in that order.
- All content in English.

**`answer-key.md`:**

```markdown
## Q1
Correct: B
Explanation: <short summary rationale — name the mechanism and why the distractors fail>
Why-A: <why A is wrong>
Why-B: <why B is correct>
Why-C: <why C is wrong>
Why-D: <why D is wrong>
Source: Lesson 1.4 — Workflow Enforcement & Handoff

## Q2
Correct: D
Explanation: <short summary rationale>
Why-A: ...
Why-B: ...
Why-C: ...
Why-D: ...
Source: Lesson 5.1 — Managing Conversation Context
```

Rules:
- One block per question, `## Q<n>` matching the exam, in order.
- `Correct:` is a single letter A–D.
- `Explanation:` is a single line (no hard line breaks). Keep it as the one-line summary.
- `Why-A`…`Why-D` give a one-line rationale per option (why each is right/wrong); the letter matching `Correct:` states why it's right. Strongly recommended — the simulator shows them per-option in review and in the saved `result.md`.
- `Source:` is one or more lines, each a lesson/subtopic reference (the "where this comes from" links). Recommended: at least one per question, matching the `Subtopic:`.
- Every line is a single line — no hard breaks, no blank-line-separated paragraphs.
- Domain/subtopic/scenario live only in `exam.md`; correctness, rationale, and sources live only in `answer-key.md`. Do not duplicate.

## Step 3 — Domain taxonomy & weightings

Use the exact names in the `Domain:` line. Weightings are for building a proportional spread when the user wants "all domains."

| # | Domain (exact name) | Weight | Subtopics |
|---|---------------------|--------|-----------|
| 1 | Agentic Architecture & Orchestration | 27% | 1.1–1.7 |
| 2 | Tool Design & MCP Integration | 18% | 2.1–2.5 |
| 3 | Claude Code Configuration & Workflows | 20% | 3.1–3.6 |
| 4 | Prompt Engineering & Structured Output | 20% | 4.1–4.6 |
| 5 | Context Management & Reliability | 15% | 5.1–5.6 |

For a weighted exam of N questions, allocate roughly N × weight per domain (e.g. N=60 → ≈16/11/12/12/9), then adjust to sum to N.

## Step 4 — Question quality rubric (the core of this skill)

**Shape.** Every question is a realistic scenario followed by a single-best-answer prompt — "What is the most reliable fix?", "What is the most likely cause?", "Which mechanism is the recommended approach?" — with four choices.

**Scenario selection (matches the real exam's behavior).** The real exam presents 4 scenarios per sitting, picked at random from the full set of 6 (`Data/exam-details.md`). Mirror this: before drafting, pick 4 of the 6 scenario families for this exam (random unless the user specifies otherwise) and draw every question's scenario from only those 4 — do not spread across all 6 in a single generated exam. The 6 families and their primary domains (from `Data/exam-details.md`):

| Scenario family | Primary domains |
|---|---|
| Customer Support Resolution Agent | 1. Agentic Architecture & Orchestration, 2. Tool Design & MCP Integration, 5. Context Management & Reliability |
| Code Generation with Claude Code | 3. Claude Code Configuration & Workflows, 5. Context Management & Reliability |
| Multi-Agent Research System | 1. Agentic Architecture & Orchestration, 2. Tool Design & MCP Integration, 5. Context Management & Reliability |
| Developer Productivity with Claude | 2. Tool Design & MCP Integration, 3. Claude Code Configuration & Workflows, 1. Agentic Architecture & Orchestration |
| Claude Code for Continuous Integration | 3. Claude Code Configuration & Workflows, 4. Prompt Engineering & Structured Output |
| Structured Data Extraction | 4. Prompt Engineering & Structured Output, 5. Context Management & Reliability |

When assigning a question's scenario, prefer a family whose primary domains include that question's target domain — don't pair a domain with a scenario family it isn't listed against above. If the requested domain mix can't be satisfied by the 4 chosen families' primary-domain coverage, swap in a different family from the 6 before drafting rather than forcing a mismatched pairing.

**Picking the correct answer** (from the Core Decision Rule): it fixes the root cause rather than a symptom; uses deterministic enforcement (gate, hook, forced tool, schema, validation) when the requirement demands a guarantee ("must always/never", "financial", "compliance", "block pre-merge"); uses prompt-level criteria/examples/descriptions when the requirement is about judgment, style, or format; and is the least over-engineered Claude-native mechanism that meets the requirement. It solves the problem actually stated, not an adjacent one.

**Building distractors.** Three per question, each one a mistake a real candidate makes. Pull from the Top Wrong-Answer Patterns:
- "Add more prompt instructions" when the requirement is deterministic.
- "Use a bigger context window" when the issue is attention dilution, stale state, or lost provenance.
- "Build a classifier/router" when the real fix is better tool descriptions or clearer criteria.
- "Filter/reshape the output" when discovery/execution is the actual problem.
- "Add one more step" or "raise a fixed count" when the fix is to remove the rigidity.
- "Return [] / trust raw confidence / let subagents talk directly / add citations downstream / put everything in root CLAUDE.md" in the situations where each is wrong.

Strengthen distractors with **real but misapplied** Claude Code / API vocabulary — `tool_choice: any` vs forced, `--max-turns`, `--continue`, `--output-format stream-json`, `AgentDefinition.prompt`, `.mcp.json` vs `~/.claude.json`, PreToolUse/PostToolUse hooks, plan mode vs direct execution, batch `custom_id`. The distractor should be technically real and only subtly wrong for this scenario. Out-of-scope topics (fine-tuning, vector DB internals, RLHF, computer use, pricing/rate limits, tokenization, etc.) may appear only as distractors, never as the correct answer.

**Option-length parity — the single most important anti-tell, and the one this skill has historically failed.** An earlier generated exam had the longest option correct in 19 of 20 questions: a candidate who never read a single scenario and always picked the longest choice would have scored ~95%. That exam was worthless as practice. Treat this as a hard requirement, not a style preference:

- **The cause is always the same mistake: putting the *justification* in the correct option.** The correct choice gets written as "mechanism — because X, so Y, which satisfies Z", while the three distractors get written as bare assertions. Options state *what to do*, in the same register, at the same level of detail. The *why* belongs exclusively in `answer-key.md`'s `Explanation:` and `Why-A`…`Why-D` lines, where the candidate reads it after answering. If you catch yourself writing "…, since/because/so that …" inside the correct option, either cut it or give every other option an equally specific clause of its own.
- **Measurable ceiling:** within a question, the longest option must be no more than ~1.25× the word count of the shortest. Roughly 22–32 words per option is a workable band. Count words — do not eyeball this.
- **Distribution across the exam:** the longest option must be the correct one in no more than ~⅓ of questions, and it must be a *distractor* in at least a quarter of them. Deliberately write some questions where the wordiest, most-qualified, most-mechanism-name-dropping option is wrong.
- **Equal specificity, not equal padding.** Do not pad distractors with filler to hit a word count. Give each distractor its own named mechanism, its own concrete detail (a flag, a field name, a number from the scenario), its own internal rationale clause. A distractor that names `--output-format stream-json` or enumerates three fields is both longer *and* more tempting.
- **Enumeration parity.** If the correct answer lists four fields/steps, at least one distractor must list a comparable number of fields/steps. A four-item correct answer against three one-clause distractors is the length tell in its purest form.
- **No hedging tell either.** The correct option must not be the only one that qualifies itself ("…, and if the window can't absorb it, defer"), nor the only one naming a real Claude mechanism, nor the only one acknowledging a trade-off. These are length bias in another costume.
- **Yes/no-verdict questions ("is the engineer's proposal correct?"): balance the polarity too.** If every such question in the exam resolves to "No, the proposal is wrong", the candidate learns to always pick the negative verdict without reading. Across an exam, some proposals must actually be correct as stated, and the "Yes"/"No" options must be the same length as each other.

**Other anti-"AI question" rules — enforce all of these:**
- The correct choice must not be guessable from any surface form: length, detail, qualification, register, or vocabulary.
- Every distractor must be genuinely tempting. No filler, no joke options, nothing eliminable without domain knowledge.
- No answer-giveaway language: avoid "always/never/all of the above/none of the above" as tells, and don't let the correct answer be the only one echoing the stem's keywords.
- Across the whole exam, spread the correct letter roughly uniformly over A/B/C/D — plan the letters up front, don't let them cluster.
- No two questions should test the same point with the same framing; vary subtopic and scenario family.
- Do not put "[SAMPLE]" or any generation/meta note into a real question — that marker belongs only to `_sample`.

## Step 5 — Generation workflow

1. Resolve `count` and `scope` from the conversation (ask briefly only if missing).
2. Read the grounding files for the targeted subtopics (Step 1), including `Data/exam-details.md`.
3. Pick 4 of the 6 scenario families for this exam (Step 4's selection rule). Plan the set: list each question's target subtopic, its scenario family (from the chosen 4, matching that family's primary domains), and its pre-assigned correct letter (balanced A–D). Confirm the domain counts match the requested mix.
4. **Shuffle the presentation order.** The plan from step 3 is naturally grouped by domain/subtopic — before writing anything, randomize that list's order (the distribution/weighting stays exactly as planned; only the sequence changes). The final exam must not read as domain-by-domain blocks (e.g. never Q1=1.1, Q2=1.1, Q3=1.2, … Q60=5.6) — question N's domain should be unpredictable from question N-1's. Number the shuffled list Q1..Qn in its new order.
5. Write the questions and their rationales, applying the Step 4 rubric, in the shuffled order from step 4. As you write each question, keep the four options at parity per Step 4's option-length rules — it is far cheaper to write them balanced than to rebalance them afterwards. Push every "because/since/so that" justification into the answer key as you go.
6. Choose the id: use the id the user gave; otherwise use the lowest unused positive integer (check `manifest.json` and `GeneratedExams/` for what's taken — note that one existing exam is named `pdf` rather than a number, a pre-existing exception sourced from the exam guide PDF; new exams should still default to numeric ids unless the user asks for a descriptive slug). Never overwrite an id that already has content without the user's say-so.
7. Write `ExamGenerator/GeneratedExams/<id>/exam.md` and `answer-key.md` in the exact format from Step 2.
8. Register the exam: run `node scripts/sync-manifest.js` — it regenerates `manifest.json` from the folders actually present under `GeneratedExams/` (this is a derived index, not hand-maintained; do not edit it directly).
9. Run `node scripts/validate-exams.js`. Fix every error it reports, and every warning that applies to the exam you just wrote, then re-run it until it is clean.
10. Run the self-check (Step 6). Fix anything that fails before reporting done.

## Step 6 — Self-check before finishing

- **Run `node scripts/validate-exams.js` first and get it to zero errors.** It mechanically checks the structural half of this list — header lines, `Total` vs question count, sequential `## Q<n>`, domain names against the taxonomy, subtopic ids and consistent spelling, non-empty `Scenario:`, exactly four `A)`–`D)` choices, key/exam question-number agreement, `Correct:` pointing at a choice that exists, and `manifest.json` being in sync. It also warns about single-paragraph stems, partial `Why-` sets, missing `Source:` lines, and a skewed correct-letter distribution. Treat those warnings as failures for a newly generated exam. The bullets below cover what it cannot check — judgement, wording, and balance — so still work through them by hand.
- `exam.md`: `# Exam <id>` / `Title:` / `Total:` present; `Total` equals the number of questions; `## Q<n>` sequential from 1 with no gaps; every `Domain:` line's number and name match the taxonomy; every `Subtopic:` line is `<d.s> <name>` with a `<d.s>` id that belongs to that domain and matches a real note; every question has a `Scenario:` line, then exactly two blank-line-separated paragraphs: paragraph 1 is generic setup with no incident specifics and no question, paragraph 2 combines the specific incident detail with the question stem (paragraph 2 must never be a bare one-line question with no incident content of its own); every question has exactly four choices `A)`–`D)`.
- `answer-key.md`: one `## Q<n>` block per question in order; every `Correct:` is a single letter A–D that exists among that question's choices; every question has an `Explanation:` on a single line, a `Why-A`…`Why-D` line per option, and at least one `Source:` line; every field is a single line; no stray paragraphs.
- **Option-length audit (mandatory, do this explicitly — do not assert it from memory).** For every question, count the words in each of the four options and note which letter is longest. Then check three things: (a) within each question, longest ≤ ~1.25 × shortest; (b) across the exam, the "longest option is the correct one" rate is at or below ~⅓ — if it is above that, the exam is broken and every offending question must be rebalanced before you report done; (c) the longest option is a distractor in at least a quarter of questions. Rebalance by cutting justification out of the correct option (it moves to the answer key's `Why-` line) and by giving distractors their own named mechanism and concrete detail — never by padding with filler. Also confirm the correct option isn't systematically the most hedged/qualified one, and that yes/no-verdict questions don't all resolve to the same polarity.
- Quality: no duplicate or near-duplicate stems; correct-letter distribution is not skewed; no keyword tell reveals the answer; each explanation names the mechanism and says why the distractors fail; question order is shuffled — scan the `Domain:` sequence and confirm there's no long run of consecutive same-domain questions beyond what chance would produce; exactly 4 distinct scenario families are used across the exam (never all 6, never fewer than 4), and each question's scenario family covers that question's domain per the primary-domains table.
- `manifest.json` is valid JSON and now includes the new id (re-run `node scripts/sync-manifest.js` if unsure).
- Report to the user: the id, the title, the question count, the domain/subtopic breakdown, and the result of the option-length audit (how often the longest option is the correct one), and remind them it's now selectable in `ExamSimulator/index.html`.

## Guardrails

- English only.
- Touch only the target exam's folder, and `manifest.json` only via `node scripts/sync-manifest.js` (never edit it directly). Do not modify other exams, `_sample`, `ExamSimulator/`, or the formats.
- Do not add this skill or the generated exam to `skills-lock.json` (that lockfile is only for GitHub-sourced skills).
- If the requested scope isn't covered by the notes, say so rather than inventing out-of-scope material.
