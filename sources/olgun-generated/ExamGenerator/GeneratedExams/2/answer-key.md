## Q1
Correct: C
Explanation: The root cause of misrouting between two similar tools is inadequate descriptions, not a missing example or a routing layer — expanding the descriptions with an explicit "use this NOT that" boundary is the lowest-effort, most effective fix.
Why-A: Consolidating both tools into one general-purpose tool is more effort than a first step warrants, and it doesn't teach the model when a full tree dump versus a single file's history is appropriate.
Why-B: A few-shot example can help but adds overhead and is not the first lever to pull when the actual problem is that the descriptions don't state the boundary between the two tools.
Why-C: Correct — rewriting both descriptions to state purpose and inputs, plus an explicit boundary line, is the documented lowest-effort fix for tool misrouting.
Why-D: A routing classifier in front of two tools is over-engineering for a problem that better descriptions solve directly.
Source: Lesson 2.1 — Designing Tool Interfaces

## Q2
Correct: A
Explanation: Inconsistent output formatting that survives repeated prose rewrites is exactly the symptom few-shot prompting fixes — 2-4 worked examples showing the exact expected style outperform more written instructions.
Why-A: Correct — concrete input/output examples teach the desired length and style far more reliably than another paragraph of prose describing it abstractly.
Why-B: "Be more consistent" is more of the same prose-instruction approach that has already failed across several rounds of rewriting.
Why-C: Plan mode agrees on architecture before implementation; it has no bearing on the stylistic consistency of a generated comment.
Why-D: The interview pattern surfaces missing requirements in unfamiliar domains; the team already knows what "the right level of detail" should look like, they just can't describe it in prose — examples solve that, not more questions.
Source: Lesson 4.2 — Few-Shot Prompting

## Q3
Correct: D
Explanation: Scanning response text for a completion phrase is unreliable because the model can emit explanatory text and a tool_use call in the same turn; the loop should end only when `stop_reason` signals `end_turn`.
Why-A: A bigger iteration cap is a safety net, not the primary stop condition, and doesn't fix a harness that's misreading completion in the first place.
Why-B: Checking `content[0].type` doesn't help either — a response can contain text first and a tool call second in the same turn, so text appearing first proves nothing about completion.
Why-C: Forcing `tool_choice: "any"` means the subagent could never return `end_turn`, so it would never be able to stop through the correct signal at all.
Why-D: Correct — `stop_reason` is the deterministic signal for whether a turn is truly finished; text content is ambiguous and can co-occur with further tool calls.
Source: Lesson 1.1 — Designing Agentic Loops

## Q4
Correct: B
Explanation: A user-level `~/.claude/CLAUDE.md` is private to that one user and is never shared with teammates; conventions every engineer should receive belong in the project-level CLAUDE.md, committed to version control.
Why-A: Copying the same content into each new teammate's private file works around the symptom but leaves the conventions unversioned, duplicated, and easy to drift out of sync — not the correct fix.
Why-B: Correct — moving the conventions to the project-level CLAUDE.md and committing it is the documented fix for conventions that should reach every teammate.
Why-C: CLAUDE.md files and rules are concatenated, not layered by precedence, so an unscoped rules file doesn't "override" the user-level file — the premise is false, and it still wouldn't reach new teammates unless committed.
Why-D: Session resumption has no mechanism for transmitting configuration between different users' sessions.
Source: Lesson 3.1 — CLAUDE.md Hierarchy & Scoping

## Q5
Correct: C
Explanation: Raw self-reported confidence is a poorly calibrated escalation signal — the model can be confidently wrong just as easily as it can be under-confident on a clean document — so escalation should instead trigger on explicit, checkable conditions like a missing required field, a failed validation, or a genuine inability to extract a value.
Why-A: Lowering the threshold only escalates fewer documents; it does nothing to fix the underlying miscalibration between confidence and actual correctness.
Why-B: Raising the threshold escalates more documents overall but still relies on the same unreliable signal, and doesn't stop confidently-wrong garbled scans from slipping through.
Why-C: Correct — explicit conditions (missing field, failed validation, inability to extract after a genuine attempt) are reliable escalation triggers, unlike self-reported confidence.
Why-D: Averaging confidence across unrelated documents doesn't address the miscalibration of any individual document's score.
Source: Lesson 5.2 — Escalation & Ambiguity Resolution

## Q6
Correct: A
Explanation: The synthesis agent only sees what the coordinator's brief contains; when the brief strips source metadata down to a plain fact list, the synthesis agent has no source data to cite — the fix is to keep claims and their sources bound together as structured data in the brief.
Why-A: Correct — passing complete, structured context (claim plus source and page number) through the brief is what keeps citations alive across the handoff.
Why-B: Giving the synthesis agent its own web-search tool duplicates work the document-analysis subagent already did and doesn't fix the missing source data for those existing findings.
Why-C: A larger model can't cite sources it was never given; the missing information is a context-passing problem, not a model-capability problem.
Why-D: An instruction to "always include citations" can't produce citations for source data that was never included in the brief in the first place.
Source: Lesson 1.3 — Subagent Invocation & Context Passing

## Q7
Correct: B
Explanation: Giving a subagent tools outside its role increases the chance it misuses them and duplicates other agents' work; the fix is to scope its toolset down to only the handful of tools its role actually requires.
Why-A: A prompt instruction not to use certain tools is a probabilistic guardrail for a problem that removing the tools entirely solves deterministically.
Why-B: Correct — scoping the subagent to the 4-5 tools its role needs, and removing the web-search tool, stops the misuse and duplicated work directly.
Why-C: A routing classifier deciding tool access per request is more infrastructure than the problem requires when simply not granting the tool in the first place is sufficient.
Why-D: Forcing one specific tool would only guarantee that tool gets called every turn, which doesn't fit a subagent that needs to use different document-analysis tools across a session and still doesn't remove the unused web-search capability.
Source: Lesson 2.3 — Tool Distribution & Tool Choice

## Q8
Correct: D
Explanation: A convention that applies to a file type spread across many directories is exactly what path-specific rules are for — a `.claude/rules/` file with a `paths` glob loads only when Claude is working with matching files.
Why-A: Root CLAUDE.md loads unconditionally for every file, wasting context when Claude is reviewing non-test files.
Why-B: A rules file with no `paths` field behaves like an always-on CLAUDE.md file, loading regardless of file type — it doesn't give the conditional, file-type-scoped behavior the team wants.
Why-C: A skill requires manual invocation; it isn't automatically applied to every matching file during a review.
Why-D: Correct — a `.claude/rules/` file with a `paths` glob matching `**/*.test.ts` loads the convention only for test files, in any of the 200+ packages.
Source: Lesson 3.3 — Path-Specific Rules

## Q9
Correct: C
Explanation: Batch API best practice is to isolate failures by `custom_id` and resubmit only the failed subset, rather than reprocessing the whole batch and paying for thousands of requests that already succeeded.
Why-A: Resubmitting all 5,000 wastes cost and time reprocessing the 4,760 that already succeeded, based on an unfounded assumption of a systemic issue.
Why-B: Splitting the retry across two different APIs and also redundantly reprocessing the successful invoices adds complexity and cost without any benefit over simply retrying the 240 failures.
Why-C: Correct — using `custom_id` to isolate exactly the 240 failed requests and resubmitting only those (with any needed fixes) is the cost-effective, targeted approach.
Why-D: `strict: true` guarantees schema-valid tool inputs; it has no bearing on requests that failed for other reasons, and re-running the whole batch is still wasteful.
Source: Lesson 4.5 — Batch Processing Strategies

## Q10
Correct: A
Explanation: A report that heavily covers one dimension of a question while barely mentioning others reflects a decomposition that never assigned those dimensions as explicit sub-tasks — the fix is to correct the coordinator's decomposition, not to add downstream patches.
Why-A: Correct — reviewing the decomposition and having the coordinator explicitly delegate separate sub-tasks for the missing dimensions fixes the root cause of the coverage gap.
Why-B: A fourth completeness-checking subagent patches around the symptom after the fact instead of fixing why the coordinator never assigned the missing work.
Why-C: Asking the synthesis agent to flag underdevelopment doesn't give it the missing research to include — it can only report a gap it can't fill.
Why-D: A broader mandate for one subagent doesn't guarantee balanced coverage and reintroduces the same ambiguity that caused the original gap — explicit, separate sub-task assignment is what closes it.
Source: Lesson 1.2 — Multi-Agent Orchestration

## Q11
Correct: D
Explanation: Transient failures should be retried locally by the subagent first; if they still fail, the subagent should propagate a structured report (failure type, what was attempted, partial results) up to the coordinator rather than hiding or overreacting to the gap.
Why-A: Returning `{results: [], status: "success"}` silently suppresses a real failure, hiding the gap from the coordinator entirely.
Why-B: Terminating the whole pipeline over one source timing out throws away the useful results already gathered from other successful queries.
Why-C: Silently dropping the failed source without reporting it still hides the coverage gap from the coordinator, even though local retry was attempted first.
Why-D: Correct — local retry followed by structured propagation (failure type, attempt, partial results) if it still fails lets the coordinator make an informed decision instead of operating on a hidden gap.
Source: Lesson 5.3 — Error Propagation in Multi-Agent Systems

## Q12
Correct: B
Explanation: When some, but not all, previously-examined material has changed, the reliable fix is a fresh session carrying a structured summary of prior work plus the names of exactly what changed, so only that subset gets re-examined.
Why-A: `--resume` reopens the session with its full history intact, so the agent would keep reasoning from the four files' pre-refactor signatures as if they were still valid.
Why-B: Correct — a fresh session with a structured summary of the investigation, naming the 4 changed files, lets the engineer re-read only those and continue with correct, non-conflicting context.
Why-C: `--fork-session` branches from the current session state, which still contains the stale understanding of the 4 refactored files — forking doesn't remove stale information, it copies it.
Why-D: Telling the agent to "disregard" prior learning about specific files doesn't remove that stale information from the session's context, where it can still influence later reasoning.
Source: Lesson 1.7 — Session State, Resumption & Forking

## Q13
Correct: A
Explanation: Finding every call site of a function means searching file contents, which is exactly what Grep is for; Glob only matches file names and paths, so it can't locate a function call inside a file's body.
Why-A: Correct — Grep searches file contents, which is what finding a function's call sites requires.
Why-B: Glob matches file names and paths, not code inside files; the function name appearing in a file's content wouldn't be found by a name-pattern match.
Why-C: Reading every matched file in full to scan for one string burns far more context than searching contents directly with Grep.
Why-D: Bash shell utilities duplicate what Grep already does natively and add unnecessary indirection for a simple content search.
Source: Lesson 2.5 — Selecting Built-in Tools

## Q14
Correct: D
Explanation: A session that generated a fix is biased toward confirming its own reasoning when it reviews that same fix; the fix is a separate `claude -p` invocation with no prior context, which has no generation reasoning to defend.
Why-A: More budget for the same session gives it more room to reason, but it still carries the same generation reasoning that biased it toward confirming its own fix as correct.
Why-B: Asking the same session to "focus on security this time" doesn't remove the confirmation bias from reviewing its own generated reasoning in the same context.
Why-C: Switching the output format changes how findings are structured, not whether the reviewing instance is independent of the generating one.
Why-D: Correct — an independent `claude -p` review with no prior context has no stake in defending the original fix and is far more likely to catch issues like the injection vulnerability.
Source: Lesson 3.6 — Integrating Claude Code into CI/CD

## Q15
Correct: C
Explanation: A 100%-guaranteed block belongs in a PreToolUse hook (the only point where execution can still be prevented) using exit code 2, while a deterministic, non-blocking data transform like timestamp reformatting belongs in a PostToolUse hook.
Why-A: A PostToolUse hook fires after the command has already run, so it cannot block `rm -rf` — blocking must happen in PreToolUse.
Why-B: Reversed — reformatting output that doesn't exist yet in PreToolUse makes no sense, and blocking in PostToolUse is too late since the command has already executed.
Why-C: Correct — PreToolUse blocks before execution (exit code 2), and PostToolUse deterministically reshapes the result afterward; each hook is used for the job it's actually suited to.
Why-D: A prompt instruction is probabilistic and cannot guarantee a destructive command is always blocked, which is exactly the kind of 100%-guarantee requirement a hook, not a prompt, should enforce.
Source: Lesson 1.5 — Agent SDK Hooks

## Q16
Correct: B
Explanation: Self-review in the same session doesn't remove confirmation bias no matter how the instruction is worded, and a single pass over 45 files invites attention dilution; the fix combines an independent reviewing instance with per-file plus cross-file integration passes.
Why-A: Extended thinking in the same session still carries the same generation reasoning that biases the review toward approval — the bias isn't a reasoning-depth problem.
Why-B: Correct — an independent instance with no stake in the original generation, combined with per-file passes and a separate integration pass, addresses both the self-review bias and the attention dilution on a large diff.
Why-C: A larger context window addresses capacity, not the quality of attention paid to files in the middle of a large diff, and doesn't touch the self-review bias at all.
Why-D: Raw self-reported confidence is not a reliable signal for deciding whether to re-review, and this still leaves the review in the same, biased session.
Source: Lesson 4.6 — Multi-Instance & Multi-Pass Review

## Q17
Correct: D
Explanation: An unreachable service is a retryable access failure the agent should know about, while zero genuine matches is a valid, final answer — collapsing both into the same generic result hides the distinction the agent needs to decide what to do next.
Why-A: Treating both as equivalent "no results" hides that one case is a real failure worth retrying and the other is a legitimate, final answer.
Why-B: Marking the unreachable case with `status: 'error'` while still returning `results: []` conflates a failure with an empty result rather than clearly separating them with distinct, structured metadata.
Why-C: Retrying a genuine zero-match result is pointless — the search already ran correctly and found nothing; only the access failure is worth retrying.
Why-D: Correct — distinguishing a retryable access failure (with structured error metadata) from a valid empty result lets the agent decide correctly whether to retry or accept the outcome.
Source: Lesson 2.2 — Structured Error Responses

## Q18
Correct: C
Explanation: An aggregate accuracy figure can hide much worse performance on a specific document type or field, so before reducing human review the team should validate by segment and use stratified sampling that includes high-confidence items, where novel confidently-wrong errors tend to hide.
Why-A: 97% overall accuracy can still mask a document type or field performing far worse; removing review based on the aggregate alone risks missing that.
Why-B: Reviewing only low-confidence documents would never surface confidently-wrong errors, which is exactly the failure mode stratified sampling of high-confidence items is meant to catch.
Why-C: Correct — validating accuracy by document type and field, and sampling across confidence levels including high-confidence items, is the documented practice before reducing human review.
Why-D: Lowering the threshold to automate more documents moves in the opposite direction of validating whether the automation is actually safe to expand.
Source: Lesson 5.5 — Human Review & Confidence Calibration

## Q19
Correct: A
Explanation: `context: fork` runs a skill in an isolated subagent so its verbose intermediate output never lands in the main conversation — only the final result returns, which is exactly the problem of a verbose skill polluting the main context.
Why-A: Correct — `context: fork` isolates the skill's execution, keeping its intermediate trace output out of the main conversation.
Why-B: Moving the content into CLAUDE.md makes it always-on for every session, which is the opposite of what's wanted for an occasional, on-demand procedure — and doesn't address the verbosity problem either.
Why-C: `argument-hint` prompts for missing parameters at invocation time; it has nothing to do with how much output the skill produces once running.
Why-D: `allowed-tools` restricts which tools a skill may use as a security boundary; it doesn't isolate or suppress the skill's own verbose output from the main conversation.
Source: Lesson 3.2 — Custom Slash Commands & Skills

## Q20
Correct: B
Explanation: `tool_choice: "auto"` allows the model to respond in plain text instead of calling a tool; guaranteeing a tool call on every request requires `any` or a forced named tool, and `strict: true` further guarantees the call's arguments are schema-valid.
Why-A: A prompt instruction is a probabilistic nudge, not a guarantee, and `auto` still permits a text-only response regardless of what the prompt asks for.
Why-B: Correct — `any` (or forcing the specific tool) guarantees a tool call every time, and `strict: true` additionally guarantees the arguments conform to the schema.
Why-C: `tool_choice: "none"` disables tool use entirely, guaranteeing the opposite of what's needed and requiring a separate, unreliable text-parsing step.
Why-D: Temperature affects sampling variability in generated text; it does not control whether the model chooses to invoke a tool.
Source: Lesson 4.3 — Structured Output with Tool Use
