# CCA-F Cheatsheet — Exam-Day Reference

**Source material:** Official Exam Guide + FAQ + Anthropic engineering blog + publicly shared community write-ups from people who passed.

> This is a conceptual study aid. It contains no real exam questions or answer keys — only the patterns and mental models the exam tests.

### Linked references

1. **[anthropic-refs.md](./anthropic-refs.md)** — Condensed notes from the two Anthropic engineering pages cited by many passers: orchestrator-worker pattern, 4×/15× token multipliers, named failure modes, rainbow deployments, the 5-criterion LLM-as-judge rubric, and the full `query()` vs `ClaudeSDKClient` + `ClaudeAgentOptions` API surface.

---

## 1. Exam Format

| Item | Value |
|---|---|
| Questions | 60 scenario-based multiple choice (1 correct of 4) |
| Duration | 120 min — **use it ALL, no speed bonus** |
| Passing | 720/1000 (scaled) |
| Scenarios | 4 of 6 picked at random — all questions anchored to those 4 |
| Attempts | One per booking |
| No penalty | for guessing — never leave blank |
| Proctor | ProctorFree (remote) |

*Verify against the current official exam guide before booking — details can change.*

---

## 2. The Mental Models That Win the Exam

### Model A — "Programmatic > Probabilistic" (most heavily tested)

> When business rules require GUARANTEED compliance, prompts are not enough.

| Situation | Right | Wrong |
|---|---|---|
| Refund > $500 must always escalate | **Hook / programmatic prerequisite** | Prompt: "escalate refunds over $500" |
| Identity verification required before refund | **Block downstream tool until prerequisite returns verified ID** | Prompt: "always call get_customer first" |
| Compliance-critical tool ordering | **tool_choice: forced** or hook | Few-shot examples of correct ordering |
| Model's self-reported confidence triggers escalation | **Explicit criteria + few-shot showing when to escalate** | Confidence score → threshold |
| Sentiment-based escalation | **Explicit criteria — frustration ≠ complexity** | Sentiment analysis on messages |
| Stale `tool_result` messages in conversation history | **New session + structured summary of prior interaction** | Prompt: "always prefer most recent tool results" |
| Citation tracking through synthesis | **Structured claim-source mappings as first-class subagent outputs** | Coordinator injects source prefix tokens in prose |
| OCR / extraction math inconsistency (sum ≠ stated total) | **`calculated_total` field alongside `stated_total` → flag mismatches to humans** | Few-shot examples of math-consistent invoices |

**Rule:** If an option says "ask Claude to decide when it's uncertain" → almost always wrong.

**Sub-rule (the biggest miss theme):** *Prompt instructions are suggestions; data-shape changes are guarantees.* When you see two plausible options and one is "instruct/prompt/few-shot the model to do X," look for the **structural** sibling — change the schema, start a new session, add a field, route to a human. That's the canonical answer.

### Model C — Anthropic-canonical answer heuristic (use when stuck between 2 options)

When two answers look equally plausible, pick the one that aligns with these hierarchies — the exam reliably prefers the LEFT side:

| Prefer | Over |
|---|---|
| Deterministic (hook / programmatic) | Stochastic (prompt / LLM judgment) |
| Hub-and-spoke / coordinator | Peer-to-peer agents |
| JSON schema + `tool_use` | Prose "output JSON" instruction |
| Hooks for hard guarantees | Prompt instructions for hard guarantees |
| Human-in-the-loop for high-stakes | Self-resolution with confidence flag |
| Explicit criteria | Sentiment / confidence-score triggers |
| Fix the root cause | Add a workaround layer |
| Independent review instance | Same-session self-review |
| Scope tools narrowly per role | Give one agent many tools |
| Fix vague tool descriptions | Add classifier / few-shot routing |

When in doubt: ask *"what would Anthropic say in a blog post about this?"* — pick that.

### Model D — Trade-off framing (the meta-pattern)

> The exam tests your judgment on tradeoffs, not concept recall.

Every scenario is really asking: **how do you balance cost vs latency vs reliability vs human-oversight?**

- Wrong answers **optimize one axis** at the others' expense (e.g. "fine-tune the model" for cost, "always escalate to human" for reliability, "give Claude full DB access" for latency).
- Right answers **balance them** with scoping, structured permissions, and explicit criteria.

Quick framing prompts on hard questions:
- What's the cost axis? (token spend, batch vs real-time)
- What's the latency axis? (real-time API vs batch, blocking vs async)
- What's the reliability axis? (deterministic enforcement vs probabilistic best-effort)
- What's the human-oversight axis? (autonomous vs HITL escalation)

Bonus least-privilege framing: *"Why would you NOT just give Claude full access to your entire database?"* → Because you scope tools per role, structure permissions, and require audit trails. The "give it everything" option is always wrong.

### Model B — "Compliance-aware > AI-confident"

> Options that reduce human oversight on high-stakes actions are usually distractors.

Right answers tend to favor:
- Human review for low-confidence extractions
- Escalation when policy is ambiguous
- Structured handoffs (customer ID, root cause, recommended action)
- Independent review instances (separate reasoning context)

### Model E — State freshness / scoped artifact invalidation

> When upstream changes, downstream artifacts age. **Match the scope of invalidation to the scope of upstream change.** Over-discarding wastes work and discards valid findings; under-discarding propagates stale assumptions into new decisions.

**Scenario family:** A saved investigation / debugging / research session has produced artifacts (web results, doc analyses, syntheses, traces). Upstream changed. How much of the session do you keep?

| Upstream change scope | Right move | Wrong move |
|---|---|---|
| **1–2 specific files changed** (e.g., one policy file + one tool schema) | **Resume the named session, identify the changed artifacts, request targeted revalidation of only those lineages** | Start fresh and rediscover everything — wastes time and discards valid prior findings |
| **Many sources revised + index refreshed**, subagent outputs cite superseded versions | **Preserve only the orchestration plan** (objectives, task division); re-derive evidence from current sources | Resume cached evidence with stale assumptions; have subagents self-check freshness |
| **Stale `tool_result` messages in conversation history** (returning customer, prior session had outdated results from a then-pending ticket) | **Start a new session, inject a structured summary of the prior interaction** (issue type, actions taken, resolution status), then make fresh tool calls before engaging | (a) Resume + filter `tool_result` messages — breaks message integrity, leaves orphaned references; (b) Resume + system prompt "prefer most recent" — prompts are suggestions |
| **Critical compliance artifact changed** (the schema your tool relies on; the policy your refund agent enforces) | **Always revalidate that lineage** before any new write/refund/extraction action, regardless of how minor it looks | Treat compliance-critical schemas like any other artifact |

**Rule:** Persisted state = the **plan**, not blindly the **evidence**. But scope the invalidation to what actually changed upstream — surgical when little changed, total when much changed. The shortcuts that look efficient (full discard, blind resume) are both anti-patterns; they fail in opposite directions.

### Model F — Match the primitive to the request shape

> A single agent can't optimally handle two request types with opposite structural shapes. The fix is decomposition by **shape**, not by topic.

**Scenario shape:** One agent handles two work types — (a) **license reviews** with a stable rubric and known checks; (b) **bug investigations** that vary per discovered call paths/logs/failing tests. A single-pass prompt misses checklist items on (a) AND wastes effort on (b).

| Request shape | Right primitive | Wrong primitive |
|---|---|---|
| Stable rubric, known checks | **Workflow / deterministic pipeline** (explicit sequential tool calls, hooks, programmatic loop) | Agentic loop "smart enough to follow the checklist" |
| Adaptive, varies per discovery | **Agentic loop** (LLM picks next tool based on prior results) | Pre-baked workflow forcing one path |
| Mix of both in one product | **Two decompositions, one per shape** (route by request type, then apply matching primitive) | One mega-prompt; one classifier; "make the agent more careful" |

**Rule (from Anthropic's "Building Effective Agents"):** don't use an agent when a workflow suffices; don't force a workflow when exploration is needed. If you see the same agent failing two opposite ways, split by shape.

### Model G — Customer-respect calibration

> When a frustrated customer asks for a human, the right move is **acknowledge + ONE move** — not zero moves (cold handoff), not many moves (tool-happy investigation). What "one move" is depends on whether the agent has enough info to resolve.

| Customer state | Agent state | Right move | Wrong moves |
|---|---|---|---|
| Frustrated + asking for human | **No info yet** (no tools called) | **Acknowledge frustration + ONE targeted question** to identify the specific issue, then escalate or resolve | (a) Full investigation: `get_customer` + `lookup_order` then escalate (over-investigation) <br> (b) `escalate_to_human` immediately with zero context (cold handoff) |
| Frustrated + asking for human | **Agent CAN resolve** (lookup confirms eligibility, policy permits) | **Acknowledge feelings + tell them it's resolvable now + offer fast path OR escalate** (preserve customer choice) | (a) Immediately `escalate_to_human` — frustrates customer with a queue when one tool call would resolve <br> (b) `process_refund` unilaterally — overrides their stated preference |

**Pattern shared by both:** acknowledge first, then **one** move that respects autonomy. The wrong-direction failures are symmetric — one is tool-happy, the other is tool-shy. The right answer always lives in the middle: one acknowledging action + one functional move.

**Heuristic on exam day:** when you see a frustrated-customer scenario, check what tool state the agent is in. **Zero tools called → ask one question.** Tools called AND resolution path exists → **offer the resolution, don't queue them.**

---

## 3. Agent SDK — Quick Reference (Domain 1 — 27%)

### The agentic loop

| Signal | Meaning | What the code does |
|---|---|---|
| `stop_reason: "tool_use"` | Model wants to call a tool | Execute tool, append result to conversation, loop again |
| `stop_reason: "end_turn"` | Model is done | Stop |

**Anti-patterns (exam traps):**
- ❌ Parsing natural language to detect completion ("Claude said 'done'")
- ❌ Iteration cap as primary stopping mechanism
- ❌ Checking for assistant text content as "done" signal
- ✅ Only `stop_reason` controls the loop

### Subagents (`Task` tool)

| Concept | Rule |
|---|---|
| Spawn mechanism | `Task` tool |
| Coordinator config | `allowedTools` MUST include `"Task"` |
| Context inheritance | **NONE** — subagent context is isolated |
| How to pass info | Include findings **directly in the subagent's prompt** |
| Parallel execution | Multiple `Task` calls in ONE coordinator response (not across turns) |
| Data format between agents | Separate content from metadata (source URLs, dates, excerpts) |
| Error handling | Subagent does local recovery; only propagates what it can't resolve + partial results |

### `AgentDefinition` — per-subagent config
- Description
- System prompt
- Tool restrictions (scoped to specialization)

### Hooks vs prompt enforcement

| Use hook | Use prompt |
|---|---|
| Business rule with $ impact | Style / formatting guidance |
| Compliance (identity verification) | Preferred tone |
| Blocking dangerous actions | Optional heuristics |
| Guaranteed data normalization (Unix vs ISO 8601) | Soft defaults |

`PostToolUse` hook intercepts **before** the model sees the result.

### Session management

| Command | Use |
|---|---|
| `--resume <session-name>` | Continue named investigation across work sessions |
| `fork_session` | Parallel exploration branches from shared baseline |
| `/compact` | Reduce context usage in extended exploration |
| Start fresh with injected summary | When prior tool results are stale |

---

## 4. MCP — Quick Reference (Domain 2 — 18%)

### Tool design (most common exam trap)

**Root cause of tool selection errors = vague descriptions.** Fix descriptions BEFORE adding routing classifiers or few-shot examples.

| Situation | Right | Wrong |
|---|---|---|
| Agent picks wrong tool between `analyze_content` and `analyze_document` | **Expand descriptions** with input formats, example queries, edge cases, boundaries | Add few-shot examples of correct routing |
| Agent misroutes similar tools | **Rename tools** to be purpose-specific (`extract_web_results`) | Build classifier |
| Generic tool misused | **Split** generic tool into purpose-specific tools | Same tool, better prompt |

### Structured error responses

```
{
  isError: true,
  errorCategory: "transient" | "validation" | "business" | "permission",
  isRetryable: true | false,
  description: "human-readable",
  partialResults: {...}  // what was achieved before failing
}
```

| Wrong (exam trap) | Right |
|---|---|
| Generic "Operation failed" | Specific category + retryable flag |
| Silent suppression (empty = success) | Distinguish access failure from empty valid result |
| Propagate all errors to coordinator | Local recovery first; propagate only unresolvable + context |
| Terminate workflow on single failure | Continue with partial results + coverage annotation |

### MCP scoping

| File | Scope | Use |
|---|---|---|
| `.mcp.json` | Project | Team-shared MCP servers |
| `~/.claude.json` | User | Personal/experimental MCP servers |
| Env var expansion | `${GITHUB_TOKEN}` | Credentials without committing secrets |

**Tools from all configured servers are available simultaneously** to the agent.

### Tool distribution across subagents

| Problem | Solution |
|---|---|
| Synthesis agent often needs simple fact-checks (85%), rarely complex (15%) | **Give synthesis agent a scoped `verify_fact` tool**; route complex through coordinator |
| Giving agent 18 tools instead of 4-5 | Degrades selection reliability — scope narrowly |
| Synthesis agent doing web searches | Anti-pattern — tools outside specialization get misused |

### `tool_choice` options

| Value | Behavior |
|---|---|
| `"auto"` | Model may return text OR call tool |
| `"any"` | Model MUST call a tool (its choice which) |
| `{"type": "tool", "name": "..."}` | Forced: must call this specific tool |

### Built-in tools (Read, Write, Edit, Bash, Grep, Glob)

| Task | Tool |
|---|---|
| Find function callers | Grep |
| Find files matching pattern (`**/*.test.tsx`) | Glob |
| Full file load | Read |
| Targeted modification with unique anchor text | Edit |
| Edit fails (non-unique match) | **Read + Write fallback** |
| Explore unknown codebase | Grep entry points → Read to trace |

---

## 5. Claude Code — Quick Reference (Domain 3 — 20%)

### CLAUDE.md configuration hierarchy

| Path | Scope | Shared? |
|---|---|---|
| `~/.claude/CLAUDE.md` | User | **NO** — personal only |
| `.claude/CLAUDE.md` or project root `CLAUDE.md` | Project | YES via version control |
| Subdirectory `CLAUDE.md` | Directory-bound | YES |

**`@import` syntax:** reference external files to keep CLAUDE.md modular.
**`.claude/rules/` directory:** split by topic (testing.md, api-conventions.md, deployment.md).

### `.claude/rules/` with glob paths (exam favorite)

```yaml
---
paths: ["**/*.test.tsx"]
---
```

**Exam trigger:** "conventions must apply to files spread across multiple directories" → use `.claude/rules/` with glob, NOT subdirectory CLAUDE.md.

### Slash commands

| Path | Scope |
|---|---|
| `.claude/commands/` | Project, version-controlled, team-wide |
| `~/.claude/commands/` | Personal, not shared |

### Skills (`.claude/skills/SKILL.md`)

| Frontmatter | Purpose |
|---|---|
| `context: fork` | Run in isolated sub-agent context (prevents output pollution) |
| `allowed-tools` | Restrict tool access during skill execution |
| `argument-hint` | Prompt for required args when invoked without them |

**Skills vs CLAUDE.md:**
- Skills = on-demand, task-specific
- CLAUDE.md = always-loaded, universal standards

### Plan mode vs Direct execution

| Use plan mode | Use direct execution |
|---|---|
| Architectural decisions | Single-file bug fix with clear stack trace |
| Multi-file changes (45+ files) | Adding one validation check |
| Multiple valid approaches | Well-scoped, known change |
| Library migrations | |
| Monolith → microservices | |

### CI/CD — Claude Code in pipelines

| Flag | Purpose |
|---|---|
| `-p` (or `--print`) | Non-interactive mode — required in CI |
| `--output-format json` | Machine-parseable structured output |
| `--json-schema <file>` | Enforce schema on output |

**Session isolation rule:** a review instance should be INDEPENDENT of the generation instance — same session retains reasoning context and won't question its own decisions.

### `/memory` command
Verify which memory files are loaded — diagnose inconsistent behavior across sessions.

### Explore subagent
Isolate verbose discovery output; main agent gets a summary. Prevents context exhaustion.

---

## 6. Prompt Engineering & Structured Output (Domain 4 — 20%)

### Best approach ladder for structured output

1. **Most reliable:** `tool_use` + JSON schema (eliminates syntax errors)
2. **Fallback:** explicit JSON format instructions + few-shot examples
3. **Avoid:** vague "output JSON" prompts

**Critical:** `tool_use` eliminates **syntax** errors, not **semantic** errors (wrong sums, misplaced values).

### Preventing hallucination

| Technique | When |
|---|---|
| Nullable/optional fields | Source document may not contain the info |
| Enum with `"other"` + detail string | Extensible categorization |
| Few-shot with varied document structures | Inline citations vs bibliographies, methodology vs embedded |
| `detected_pattern` field | Enable analysis of false-positive patterns |

### Few-shot prompting

- 2-4 targeted examples
- Show reasoning for ambiguous cases
- Demonstrate format consistency
- Cover varied structures (not just the common one)

### Multi-source claim tracking

When a research / synthesis pipeline has multiple subagents producing cited claims and a downstream agent must combine them without losing attribution:

| Right | Wrong |
|---|---|
| **Structured claim-source mappings** as first-class subagent outputs (e.g., `{claim, source_ids[]}`) that synthesis MUST preserve and merge deterministically | Source identifier prefix tokens injected into prose — get dropped, paraphrased, hallucinated |
| Explicit schema for claim→source binding before synthesis runs | Post-hoc citation reconstruction (semantic similarity matching against original sources) — attributes wrong source when two say similar things |
| Full subagent transcript with citation-resolution agent | Post-hoc log analysis — fragile, expensive, still loses bindings when synthesis merges points |

**Rule:** if attribution must survive an aggregation step, it has to be in a **structured field**, not in the prose body. Same Mental Model A principle: prose is suggestion, schema is guarantee.

### Extraction math consistency

When extracting fields that have internal mathematical relationships (line items + grand total, subtotals + sums), and source documents are sometimes inconsistent (OCR errors, scan artifacts):

| Right | Wrong |
|---|---|
| **Add a `calculated_total` field alongside `stated_total`; flag records for human review when values differ** | Few-shot examples of math-consistent invoices — can't fix data that's inconsistent in the source |
| Capture the discrepancy as a **first-class signal** — uniformly catches OCR errors AND model mistakes | Reconciliation model that silently picks one number — masks errors |
| Route only the mismatched fraction (e.g., 18%) to humans | Auto-adjustments to make math work — fabricates line items |

**Rule:** when the source can be wrong, the right answer is **make the discrepancy explicit as data**, then route the contradictions to humans. Don't try to prompt-engineer your way out of inconsistent source data.

### Validation-retry loop

```
Extraction fails validation
    ↓
Send: original doc + failed extraction + specific validation error
    ↓
Model self-corrects (for format errors)
```

**Retry won't fix:** information not in source document.
**Retry will fix:** format mismatches, structural errors.

### Multi-pass review (large code reviews)

| Problem | Solution |
|---|---|
| 14 files reviewed together → inconsistent depth, contradictory feedback | **Split:** per-file local pass + separate cross-file integration pass |
| Larger context window fix? | NO — doesn't solve attention dilution |
| Developers split PRs smaller? | NO — shifts burden without fixing system |
| 3 independent reviews, flag 2+ consensus? | NO — suppresses real bugs |

### Self-review vs Independent review

| | Self-review | Independent review |
|---|---|---|
| Context | Shared with generator | Clean slate |
| Effectiveness | Low — retains reasoning bias | High — catches subtle issues |
| When | Never for critical reviews | Always for quality gates |

### Explicit criteria beats vague instructions

| Wrong | Right |
|---|---|
| "Be conservative" | "Flag only when X contradicts Y" |
| "Only report high-confidence findings" | "Report bugs, security issues. Skip style, local patterns." |
| "Improve precision" | Define severity levels with concrete examples per level |

---

## 7. Message Batches API (Domain 4)

| Property | Value |
|---|---|
| Cost savings | 50% |
| Processing window | Up to 24h |
| Latency SLA | **NONE** |
| Multi-turn tool calling | **NOT SUPPORTED** in single request |
| Correlation | `custom_id` for request/response pairs |

| Use batch | Don't use batch |
|---|---|
| Overnight reports | Pre-merge checks (blocking) |
| Weekly audits | User-facing real-time |
| Nightly test generation | Interactive workflows |

**Failure handling:** resubmit only failed docs (identified by `custom_id`) with modifications (e.g., chunk oversized docs).

### Batch SLA arithmetic

When a question gives you an SLA, a continuous-arrival document stream, and asks how often to submit batches, **do the math explicitly and pick the option with a safety cushion**:

```
worst_case_total = max_batch_wait + 24h (Batch API processing window)
must satisfy: worst_case_total ≤ SLA
ideal answer: worst_case_total < SLA by a margin (the cushion)
```

**Worked example (30h SLA, 99.9% reliability target):**

| Batch wait | Worst case | Margin | Verdict |
|---|---|---|---|
| 4h | 4 + 24 = 28h | **2h cushion** | ✅ Right answer — survives variance |
| 6h | 6 + 24 = 30h | 0h cushion | ❌ Trap — meets SLA exactly, fails on any variance |
| 30h+ batch | > SLA before batch closes | negative | ❌ Obviously wrong |
| Real-time | trivially meets SLA | — | ❌ Defeats the 50% cost saving the question asks you to capture |

**Rule:** when a 99%+ reliability target is mentioned, the right answer is **never the one that exactly hits the SLA** — pick the one with explicit cushion.

---

## 8. Context Management & Reliability (Domain 5 — 15%)

### Progressive summarization risks

| What gets lost | Mitigation |
|---|---|
| Numerical precision (amounts, percentages) | Extract to persistent "case facts" block |
| Dates, order IDs, statuses | Keep OUTSIDE summarized history |
| Customer-stated expectations | Structured facts, not prose |

### Lost-in-the-middle effect

- Models process **start + end** reliably
- May omit findings from **middle sections**
- **Mitigation:** key findings summaries at the BEGINNING of aggregated inputs; explicit section headers

### Tool output trimming

- Order lookup returns 40+ fields, you need 5
- **Trim to only relevant fields** before they accumulate in context

### Scratchpad files

- Persist key findings across context boundaries
- Subagents export state to known location
- Coordinator loads manifest on resume → inject into agent prompts

### Confidence calibration

| Wrong | Right |
|---|---|
| Aggregate accuracy (97% overall) | **Segment by document type and field** |
| LLM self-reported confidence | **Field-level confidence calibrated with labeled validation sets** |
| "Good enough on average" | **Stratified random sampling** for ongoing error rate measurement |

### Escalation triggers

| Trigger | Escalate? |
|---|---|
| Customer explicitly asks for human | ALWAYS immediately (honor preference) |
| Policy is silent on customer's request (edge case) | YES — policy gap |
| Inability to make meaningful progress | YES |
| Multiple customer matches on lookup | Clarify with additional identifier (don't heuristically pick) |
| Customer is frustrated (sentiment) | NO — acknowledge + offer resolution first |
| Complex case | NOT alone — complexity ≠ escalation trigger |

### Information provenance in multi-source synthesis

- Preserve **claim-source mappings** through synthesis
- Annotate **conflicts** (don't arbitrarily pick one value)
- Include **publication/collection dates** to prevent temporal misinterpretation
- Distinguish well-established from contested findings in reports

---

## 9. The 6 Scenarios — One-Line Mental Model

1. **Customer Support Agent** → Tool ordering with programmatic prerequisites, structured errors, escalation criteria
2. **Code Generation with Claude Code** → CLAUDE.md hierarchy, plan mode for architecture, explicit review criteria
3. **Multi-Agent Research** → Coordinator decomposition scope, parallel `Task` calls, structured error propagation, provenance
4. **Developer Productivity** → Built-in tools vs MCP, scoping tools per role
5. **CI/CD Pipeline** → `-p` flag, JSON schema output, multi-pass review, batch API for non-blocking
6. **Structured Data Extraction** → JSON schema + tool_use, validation-retry, few-shot for format variety

---

## 10. The 18 Anti-Patterns — Memorize These (organized by domain weight)

Each row is a distractor pattern the exam reliably uses, paired with its canonical right answer. If two answer choices contradict each other, find which one matches the LEFT column → that's the wrong one; the other is the answer.

### Agentic Architecture (27%) — 5 anti-patterns

| # | Anti-pattern | Why it's wrong | Canonical replacement |
|---|---|---|---|
| 1 | Peer-to-peer multi-agent communication | Coordination chaos, no provenance, hard to debug | **Hub-and-spoke / coordinator pattern** |
| 2 | Summarizer agent in the loop | Adds latency + hallucination risk | Coordinator inlines the summary itself |
| 3 | Iteration cap or parsing assistant text as stop signal | Brittle, doesn't reflect Agent SDK reality | **Only `stop_reason` controls the loop** |
| 4 | Sentiment-based escalation ("customer sounds frustrated") | Frustration ≠ complexity; unreliable | **Explicit criteria** (policy gap, customer asks, can't make progress) |
| 5 | Self-reported confidence score for escalation | Models are poorly calibrated on hard cases | Explicit criteria + few-shot examples; or **field-level confidence calibrated on labeled sets** |

### Tool Design & MCP (18%) — 4 anti-patterns

| # | Anti-pattern | Why it's wrong | Canonical replacement |
|---|---|---|---|
| 6 | Classifier / routing layer for tool selection | Over-engineered when descriptions are the root cause | **Fix vague tool descriptions** (formats, examples, boundaries) |
| 7 | Give one subagent many tools (10+) | Cross-specialization misuse; selection reliability drops | **Scope tools narrowly per role** |
| 8 | Generic error status / silent empty result | Coordinator can't distinguish failure vs valid empty vs partial | **Structured error: `errorCategory`, `isRetryable`, `partialResults`** |
| 9 | Retry on "information absent from source" | Retries fix transient and format errors, NOT missing info | Surface absence with `nullable` fields or escalation |

### Claude Code (20%) — 4 anti-patterns

| # | Anti-pattern | Why it's wrong | Canonical replacement |
|---|---|---|---|
| 10 | Team conventions in `~/.claude/CLAUDE.md` | User-level isn't version-controlled, doesn't share | **Project-level `.claude/CLAUDE.md` or root `CLAUDE.md`** |
| 11 | Subdirectory CLAUDE.md for cross-directory conventions (e.g. test rules) | Directory-bound; can't catch `**/*.test.tsx` spread across dirs | **`.claude/rules/` with glob `paths:` frontmatter** |
| 12 | Same-session review of own generation | Shared reasoning context = bias preserved | **Independent review instance** (clean slate) |
| 13 | Batch API for blocking pre-merge checks | 24h processing window, no latency SLA | Real-time API with `-p` + `--output-format json` + `--json-schema` |

### Prompt Engineering (20%) + Context & Reliability (15%) — 5 anti-patterns

| # | Anti-pattern | Why it's wrong | Canonical replacement |
|---|---|---|---|
| 14 | Fine-tuning / vector DB / model switching | Over-engineered when problem is prompt or tool design | **Fix prompts/tools first**; reach for these only if proven necessary |
| 15 | Bigger context window to fix inconsistent depth | Doesn't fix attention dilution / lost-in-the-middle | **Multi-pass focused review** (per-file + cross-file pass) |
| 16 | Probabilistic compliance via prompt ("always call X first") for $-impact / compliance rules | Stochastic — fails sometimes; can't audit | **Hook / programmatic prerequisite** (deterministic block) |
| 17 | Vague "be conservative" / "improve precision" instructions | Model can't operationalize | **Explicit criteria**: "Flag only when X contradicts Y" / severity levels with examples |
| 18 | Progressive summarization of full chat history | Loses numeric precision (amounts, dates, IDs) | **Persistent "case facts" block** outside the summarized window |

### Additional traps seen on the exam

- "Terminate workflow on single failure" → local recovery + propagate structured context with `partialResults`
- "Cache context around sources speculatively" → scoped tool for the common case
- "3 independent reviews, 2-of-3 consensus" for code review → suppresses real bugs; use per-file + cross-file passes instead
- "Aggregate accuracy (97% overall)" as quality signal → segment by document type and field

---

## 11. Practice & Study Strategy

- **Use fresh practice pools.** If you've memorized a practice set, it no longer measures readiness — find questions you haven't seen.
- **Review EVERY question** — right and wrong. Classify each miss: knowledge gap / misread / two-good-options-needed-canonical-rule.
- **Keep a "wrong-twice" list** of any anti-pattern not already in Section 10.
- **Build a custom Claude tutor** (a high-leverage, free move): a Claude project with the official exam guide + this cheatsheet + your "wrong-twice" list, prompted to generate fresh scenario questions targeting your weakest domain.

### Free, publicly available community resources
- `claudecertificationguide.com` — practice questions + a full mock, no signup.
- Community GitHub guides with "Common Pitfalls" per domain and practice exercises in multiple languages.
- Free mock exams shared by passers on Reddit and personal blogs.

### Required reading for the multi-agent scenario
- `anthropic.com/engineering/multi-agent-research-system`
- `platform.claude.com/cookbook/claude-agent-sdk-00-the-one-liner-research-agent`

*(See [anthropic-refs.md](./anthropic-refs.md) for condensed notes on both.)*

---

## 12. Exam-Day Strategy

### ProctorFree precautions

1. **Dedicated browser profile** for the exam. No other tabs, no extensions, no notifications.
2. **Pin the ProctorFree window.** On macOS: do not Cmd-W, do not Cmd-Q. Resize so it's always visible. Disable trackpad gestures that switch spaces.
3. **Dry launch 30 min pre-exam** — verify ProctorFree opens, camera + mic + ID flow works, window stays stable.
4. **Phone:** silent, face down, in another room if possible.

### Pre-exam (night before)
- Re-read this cheatsheet — focus on Sections 2 (Model C) and 10
- Test ProctorFree (see above)
- Sleep 7+ hours

### During exam
- **Use ALL 120 minutes** — no bonus for speed. Meticulous reasoning wins.
- **Two-pass strategy:** Pass 1 answer confident ones, flag hard ones; Pass 2 return to flags.
- **Read every question twice** — misread = lost point
- **Never leave blank** — no penalty for guessing
- **When stuck between two options:**
  - Which one relies on prompt-based behavior vs programmatic enforcement? → programmatic usually wins
  - Which one keeps a human in the loop for high-stakes? → usually wins
  - Which option addresses the root cause vs a workaround? → root cause wins
- **Anchor every question to its scenario** — the scenario's domain hints at what's being tested

### Red flags — distractor indicators
- "Let Claude decide when to..."
- "Ask the model to report confidence..."
- "Use sentiment analysis..."
- "Add more tools..."
- "Larger context window..."
- "Self-review..."
- "Terminate on error..."
- "Generic error status..."

---

## 13. Pre-Exam Final Checklist

- [ ] All 18 anti-patterns in Section 10 recallable cold (cover the right column, regenerate it)
- [ ] Section 2 Model C canonical-answer hierarchy memorized
- [ ] 6 scenarios one-line summary memorized
- [ ] Agent SDK: can explain `stop_reason`, `Task`, `allowedTools`, hooks, `fork_session`
- [ ] MCP: can explain `isError`, `errorCategory`, `isRetryable`, `.mcp.json` scoping
- [ ] Claude Code: can explain CLAUDE.md hierarchy, `.claude/rules/` glob syntax
- [ ] Prompt eng: tool_use + JSON schema, nullable fields, few-shot count (2-4)
- [ ] Batch API constraints memorized (50%, 24h, no multi-turn)
- [ ] Context: lost-in-the-middle, progressive summarization risks, scratchpad
- [ ] ProctorFree dry-launched on dedicated browser profile (Section 12)
- [ ] Phone silent, quiet room, ID, good lighting
