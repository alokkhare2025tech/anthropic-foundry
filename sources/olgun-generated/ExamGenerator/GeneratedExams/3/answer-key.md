## Q1
Correct: A
Explanation: A model response can contain an explanatory text block and a tool_use block in the same turn, so checking content type or ordering is unreliable; only stop_reason distinguishes "still calling tools" (tool_use) from actually done (end_turn).
Why-A: Correct — stop_reason is the deterministic signal; "tool_use" means keep looping and execute the queued call regardless of any text present earlier in the same response.
Why-B: Content ordering isn't a documented completion signal, and the same response can legitimately mix text and tool_use in either order — this doesn't fix the underlying problem.
Why-C: Forcing tool_choice:"any" would stop the model from ever returning end_turn, since it would be forced to call a tool on every turn, breaking the agent's ability to stop.
Why-D: The iteration cap is only a safety fallback against runaway loops, not the mechanism for detecting genuine completion, and lowering it would just cut the agent off earlier.
Source: Lesson 1.1 — Designing Agentic Loops

## Q2
Correct: D
Explanation: Misrouting between look-alike tools traces back to thin descriptions; the lowest-effort, most effective fix is expanding each tool's description with purpose, inputs, examples, and an explicit boundary against the other tool — not a classifier, examples, or consolidation.
Why-A: Few-shot examples add prompt overhead and don't fix the descriptions the model actually reasons over when selecting a tool.
Why-B: A routing classifier over-engineers a problem that a clearer description solves directly, and adds another component to maintain.
Why-C: Consolidating into one tool is more effort than warranted as a first step and can reintroduce ambiguity about what a single call returns.
Why-D: Correct — expanding descriptions with an explicit "use this NOT that" boundary is the guide's documented lowest-effort fix for misrouting between similar tools.
Source: Lesson 2.1 — Designing Tool Interfaces

## Q3
Correct: C
Explanation: CLAUDE.md files at every level are concatenated into context rather than one overriding another by specificity, so a directory-level file doesn't silently win over root — the fix is removing the actual contradiction and confirming what's loaded with /memory.
Why-A: There's no --scope flag gating directory-level CLAUDE.md activation; this isn't a real mechanism.
Why-B: There's no ".local" naming convention that grants precedence; CLAUDE.md hierarchy doesn't work by filename suffix.
Why-C: Correct — the files concatenate rather than override, so the contradiction must be resolved in the instructions themselves, with /memory used to confirm exactly what's loaded.
Why-D: This could work but is a heavier restructuring than needed; a path-specific rule is for a file-type convention across directories, not for silencing a directly conflicting instruction in a subtree — and it sidesteps the real lesson that concatenation, not precedence, is the mechanism.
Source: Lesson 3.1 — CLAUDE.md Hierarchy & Scoping

## Q4
Correct: C
Explanation: A high false-positive rate in one category erodes trust in every category, including accurate ones; the guide's fix is to disable the noisy category outright while refining its criteria with explicit examples, rather than tuning a confidence threshold that's poorly calibrated anyway.
Why-A: Model self-confidence is poorly calibrated, so raising the threshold still lets confidently-wrong findings through and doesn't restore trust in the other categories already being ignored.
Why-B: A classifier addresses routing, not the underlying vague criteria producing the false positives, and adds a component without fixing the root cause.
Why-C: Correct — disabling the noisy category restores trust in the rest immediately, while explicit report/skip criteria and examples are what actually fix the false-positive rate.
Why-D: Plan mode is a Claude Code execution-strategy choice for ambiguous, multi-file work, not a mechanism for calibrating review-finding precision.
Source: Lesson 4.1 — Prompts with Explicit Criteria

## Q5
Correct: C
Explanation: Progressive summarization reliably destroys transactional specifics unless they're protected; the fix is a persistent case-facts block for exact figures plus trimming verbose tool output to relevant fields — not disabling summarization, growing the budget, or prompting the summarizer to "be careful."
Why-A: Disabling summarization removes the tool meant to manage context size and doesn't scale as disputes get longer; it treats the symptom, not the structural need to protect specific facts.
Why-B: A bigger budget delays when summarization triggers but doesn't stop it from destroying transactional details once it does.
Why-C: Correct — a protected case-facts block survives summarization by design, and trimming the tool result to relevant fields prevents unrelated bloat from crowding out what matters.
Why-D: A prose instruction to "preserve all important numbers" is still probabilistic; the guide's fix is a structural mechanism, not a stronger reminder to the same lossy process.
Source: Lesson 5.1 — Managing Conversation Context

## Q6
Correct: B
Explanation: An iteration cap should never be the primary completion signal — it either wastes turns on tasks that finish early or cuts off ones that legitimately need more steps; stop_reason: end_turn is the reliable completion signal, with the cap kept only as a safety net.
Why-A: Removing the cap entirely leaves no safety net against a genuinely runaway or looping agent, which the guide still recommends keeping as a fallback.
Why-B: Correct — the cap's proper role is a safety fallback, not the primary stop condition, which should be stop_reason reaching end_turn.
Why-C: Lowering the cap further makes the exact problem described (real work being cut off) worse, not better.
Why-D: Swapping the unit from turns to files doesn't address the underlying issue — a fixed count of any kind is still an unreliable proxy for actual completion.
Source: Lesson 1.1 — Designing Agentic Loops

## Q7
Correct: A
Explanation: A vague catch-all tool whose behavior depends on hidden modes is hard to route to correctly no matter how it's described; the guide's fix is splitting it into purpose-specific tools with clear, distinct contracts, not documenting the modes more thoroughly or adding a routing layer in front of it.
Why-A: Correct — splitting into purpose-specific tools gives the model a crisp input/output contract per tool, eliminating the guesswork hidden modes create.
Why-B: Examples add overhead without removing the structural ambiguity of one tool silently branching into different outputs.
Why-C: A longer description of hidden modes is still one tool the model must guess a parameter combination for; it doesn't remove the ambiguity, just documents it.
Why-D: A routing classifier in front of a single overloaded tool over-engineers what splitting the tool would solve directly.
Source: Lesson 2.1 — Designing Tool Interfaces

## Q8
Correct: D
Explanation: Verbose exploratory output from a skill is exactly what context: fork is for — it isolates the skill's work in a subagent so only a summary re-enters the main context, rather than restricting tools or renaming the skill's location.
Why-A: argument-hint helps users supply required parameters when invoking a command; it doesn't isolate or reduce the skill's own exploratory output.
Why-B: Restricting allowed-tools is a security/scope boundary on what the skill can do, not a mechanism for keeping its verbose output out of the main context.
Why-C: Skills already live under .claude/skills/; commands and skills are different mechanisms, and moving files between directories doesn't isolate context.
Why-D: Correct — context: fork runs the skill's exploration in an isolated subagent, keeping the verbose intermediate output from polluting the main review session.
Source: Lesson 3.2 — Custom Slash Commands & Skills

## Q9
Correct: D
Explanation: A high false-positive rate in one field is damaging trust across the whole extraction, including accurate fields; the guide's fix is disabling the noisy field while refining its criteria with explicit examples, not tuning a confidence threshold that's poorly calibrated to begin with.
Why-A: Averaging confidence across recent documents doesn't address the underlying vague criteria producing false positives, and confidence itself remains poorly calibrated.
Why-B: Raising the threshold still relies on the model's poorly-calibrated self-reported confidence and doesn't restore trust in the fields already being ignored.
Why-C: A nullable "unclear" value is useful schema design for genuine ambiguity, but it doesn't fix a field whose criteria are producing outright false positives at a high rate.
Why-D: Correct — disabling the noisy field restores trust in the rest of the extraction immediately, while explicit criteria and examples are what actually fix its false-positive rate.
Source: Lesson 4.1 — Prompts with Explicit Criteria

## Q10
Correct: D
Explanation: Sentiment and self-reported confidence are both unreliable escalation triggers — frustration doesn't imply complexity and confidence is poorly calibrated — the valid triggers are an explicit human request, a genuine policy gap, or inability to make progress, exactly the tax-jurisdiction case described.
Why-A: Repetition alone doesn't distinguish a trivial correction from a genuinely stuck case, and isn't one of the guide's valid triggers.
Why-B: Sentiment is explicitly an unreliable trigger — a frustrated vendor can still have a one-step, easily resolved issue.
Why-C: Recalibrating confidence is a real improvement for routing decisions elsewhere, but confidence remains an unreliable primary escalation trigger even when calibrated.
Why-D: Correct — the three valid triggers (explicit request, policy gap, inability to progress) correctly separate the frustrated-but-trivial case from the genuinely undocumented one.
Source: Lesson 5.2 — Escalation Ambiguity Resolution

## Q11
Correct: C
Explanation: When every subagent succeeds but the final output still misses whole areas the ticket raised, the signature failure is the coordinator's decomposition, not the workers — it should be fixed to cover all relevant concerns, not patched by giving a subagent more tools, letting subagents talk directly, or bolting on another subagent.
Why-A: The shipping subagent completed its investigation successfully; giving it more tools doesn't address a report that's being dropped, not a broken worker.
Why-B: Subagents don't communicate directly in a hub-and-spoke design — all communication is meant to route through the coordinator, and there's no indication of direct communication here.
Why-C: Correct — this is the guide's signature failure: workers succeed but the coordinator's decomposition was too narrow, so it silently drops an entire concern from the final synthesis; the fix is broadening decomposition to cover every issue raised.
Why-D: Adding another subagent doesn't fix a coordinator that never asked the shipping question in its decomposition — the report is missing because it was never sought, not because merging failed.
Source: Lesson 1.2 — Multi-Agent Orchestration

## Q12
Correct: B
Explanation: A generic "Operation failed" gives the agent nothing to act on; structured error metadata — failure category, an explicit isRetryable flag, and both technical and user-facing messages — lets it retry only the transient timeout and escalate the business-rule (over-limit) and business/duplicate (already-refunded) failures instead of retrying all three identically.
Why-A: A single refund_possible boolean collapses three different failure types into one signal and doesn't tell the agent whether the cause is transient, a validation problem, or a permanent business rule.
Why-B: Correct — categorizing the failure plus an isRetryable flag is exactly what lets the agent distinguish the timeout (retry) from the over-limit and already-refunded cases (don't retry, escalate/explain).
Why-C: A raw HTTP status code from the gateway pushes the categorization work back onto the agent and doesn't give it the retryability or user-facing framing it needs.
Why-D: A uniform fixed retry count still treats all three failure types the same and retries the two cases that can never succeed on retry.
Source: Lesson 2.2 — Structured Error Responses

## Q13
Correct: A
Explanation: A convention tied to a file type spread across many directories is exactly what a path-specific rule is for — a .claude/rules/ file with a paths glob loads only when Claude touches a matching file, avoiding both the always-on pollution of root CLAUDE.md and the 40+ copies a directory-level or imported approach would require.
Why-A: Correct — the paths glob makes the rule conditional on file type rather than directory, loading once and applying everywhere a *.test.tsx file is touched.
Why-B: A single directory-level CLAUDE.md is scoped to one directory's subtree; it wouldn't apply to test files scattered across 40+ separate package directories.
Why-C: A skill loads on demand when invoked; a testing convention that should apply automatically whenever a matching file is touched needs an always-conditional mechanism, not a manually-triggered one.
Why-D: @import still means maintaining 40+ CLAUDE.md files that each reference the shared import — more upkeep than a single glob-based rule, and it still loads unconditionally in each of those directories rather than only for matching files.
Source: Lesson 3.3 — Path-Specific Rules

## Q14
Correct: A
Explanation: Few-shot examples — 2 to 4 worked cases showing a code pattern, its correct severity, and why — are the most effective fix for output that's inconsistent despite detailed prose, outperforming more instructions, confidence thresholds, or temperature changes.
Why-A: Correct — concrete worked examples teach the model the actual boundary between severity levels far more reliably than another paragraph of abstract description.
Why-B: More prose is the same technique that already produced inconsistent results across three paragraphs; a fourth doesn't change the underlying mechanism.
Why-C: Temperature affects output variability in general but doesn't teach the model what distinguishes "blocking" from "nit" — it's not the documented fix for this symptom.
Why-D: A confidence threshold filters which findings post, but doesn't address why identical patterns get inconsistent severity labels in the first place.
Source: Lesson 4.2 — Few-Shot Prompting

## Q15
Correct: A
Explanation: Returning empty results marked "complete" is silent suppression — the worst outcome, since the coordinator now believes there's no discrepancy when the gateway was never actually queried; the fix is local recovery for transient failures first, then structured propagation (failure type, attempted query, partial results) only if it truly can't recover.
Why-A: Correct — this combines both guide practices: retry transient failures locally first, and if unrecoverable, propagate structured context instead of hiding the failure as a false success.
Why-B: Aborting the entire workflow over one recoverable, potentially-transient timeout is the other documented anti-pattern — the coordinator should be able to proceed or retry, not have the whole ticket workflow terminate.
Why-C: Self-reported confidence is an unreliable signal for escalation decisions, and this failure is a technical timeout, not an ambiguous judgment call requiring human input.
Why-D: Transient failures should be recovered from locally by the subagent itself before ever bothering the coordinator — treating every transient hiccup as automatically the coordinator's problem defeats the purpose of local recovery.
Source: Lesson 5.3 — Error Propagation in Multi-Agent Systems

## Q16
Correct: D
Explanation: Running every subagent on every request regardless of need is the documented anti-pattern of static (non-dynamic) subagent selection; the coordinator should decide which subagents a given request actually calls for.
Why-A: Merging them into one subagent still produces documentation work nobody asked for on a tests-only request; it doesn't fix the root cause of over-triggering.
Why-B: The iteration cap is a safety fallback against runaway loops, not a mechanism for deciding which subagents are relevant to a given request.
Why-C: A broader tool set for the documentation-writer doesn't stop it from running unnecessarily on a request that never asked for documentation.
Why-D: Correct — dynamic subagent selection based on what the request actually needs is exactly what prevents wasted work on every simple request.
Source: Lesson 1.2 — Multi-Agent Orchestration

## Q17
Correct: C
Explanation: Decision complexity from an oversized toolset (roughly 18 vs a focused 4-5) is itself what degrades selection reliability; the fix is scoping tools by role — not more examples, forcing tool_choice, or renaming while keeping everything on one agent.
Why-A: Covering 18 tools with examples adds substantial prompt overhead and doesn't reduce the decision complexity created by having that many options in the first place.
Why-B: Forcing tool_choice:"any" guarantees a tool call happens but doesn't help the agent pick the correct one among 18 similar options.
Why-C: Correct — scoping each agent's toolset to a focused role-relevant set (roughly 4-5 tools) is the documented fix for reliability degrading as tool count grows.
Why-D: Renaming tools may help distinguish look-alikes, but it doesn't address the core problem that decision complexity rises with tool count regardless of naming.
Source: Lesson 2.3 — Tool Distribution & Tool Choice

## Q18
Correct: B
Explanation: The choice between plan mode and direct execution turns on ambiguity and scope — how many valid approaches exist and how many files are affected — not on difficulty or which pipeline triggered the change; the single-file timestamp fix is well-scoped for direct execution, while the shared-fixture case has multiple valid approaches and cross-file consistency implications that call for plan mode first.
Why-A: Whether a human is present isn't the documented criterion for plan vs direct — the criterion is ambiguity and scope of the change itself.
Why-B: Correct — matches the guide's criterion exactly: single-file, known-approach change goes direct; multi-approach, multi-file-consistency change goes to plan mode first.
Why-C: This inverts the documented trap — a bug being harder to fix doesn't call for direct execution, and using plan mode for the trivial single-line fix over-plans a well-scoped change; the decision is about ambiguity/scope, not difficulty, and it's applied backward here.
Why-D: A blanket "always plan mode" for any change to test infrastructure ignores that plan mode's benefit only pays off when scope or approach is genuinely ambiguous — the trivial timestamp fix doesn't need it.
Source: Lesson 3.4 — Plan Mode vs Direct Execution

## Q19
Correct: B
Explanation: tool_choice:"auto" always leaves the model free to return text instead of a tool call; guaranteeing a tool call on every document requires "any" (or forcing the specific tool) — strict:true only guarantees the tool's inputs are schema-valid once it's called, it doesn't force the call itself.
Why-A: An example may nudge behavior but doesn't structurally guarantee a tool call the way tool_choice does; "auto" still permits a text response.
Why-B: Correct — "any" (or a forced named tool) is the documented mechanism that guarantees some tool call happens instead of a text reply.
Why-C: strict:true governs whether the tool's arguments conform to the schema once called; it has no effect on whether the model chooses to call a tool at all under "auto".
Why-D: Temperature affects general output variability, not whether tool_choice permits a text-only response — it isn't the documented mechanism for guaranteeing a tool call.
Source: Lesson 4.3 — Structured Output with Tool Use

## Q20
Correct: B
Explanation: The drift from specific per-vendor facts to generic "typical" statements over a long exploration session is context degradation driven by attention quality, not context-window capacity — the guide's primary fix is scratchpad files that persist specific discoveries to disk as the agent goes, not a bigger window.
Why-A: A bigger context window doesn't fix attention-quality degradation; the guide explicitly rejects this as the fix for drift toward generic answers.
Why-B: Correct — scratchpad files are the primary documented fix for this exact symptom, preserving specific per-vendor findings on disk rather than trusting them to survive in a degrading live context.
Why-C: /compact should be used proactively during a long session, not only once the window is already full — waiting until the limit is reached is the documented anti-pattern.
Why-D: Delegating to a subagent for isolation is a valid technique, but framing it purely as a parallelization speedup misses its primary documented benefit here — context isolation — and doesn't by itself solve the single agent's live-context drift if it isn't paired with persisted findings.
Source: Lesson 5.4 — Context in Large Codebase Exploration

## Q21
Correct: A
Explanation: If a coordinator can't spawn any subagent at all — silently doing the work itself with no visible error — the near-universal cause is that the coordinator's own allowed-tools list doesn't include the Agent/Task tool; that's a simple on/off switch that fails without any error message.
Why-A: Correct — this exact silent-failure pattern (coordinator does the work itself, no error) is the documented signature of the coordinator lacking the Agent/Task tool in its own allowed-tools list.
Why-B: The Agent/Task tool belongs in the coordinator's own tool list to spawn subagents — a subagent is not expected to spawn its own subagents, so this wouldn't be checked on the subagent side for this symptom.
Why-C: If the coordinator genuinely couldn't spawn the subagent due to a missing permission, there would be no subagent response to isolate in the first place; this describes a different failure mode (a spawned subagent whose response doesn't return) that doesn't match "coordinator handles it itself silently."
Why-D: A missing model field is not a documented cause of a coordinator silently doing the work itself; the AgentDefinition's required fields are description and prompt, with model as one of several optional extras.
Source: Lesson 1.3 — Subagent Invocation & Context Passing

## Q22
Correct: D
Explanation: tool_choice supports a forced form — {type: "tool", name: ...} — specifically for mandating a particular tool on a given turn; forcing get_customer on the first turn deterministically replaces the prompt-only instruction that was probabilistically being skipped.
Why-A: This misstates the forced form of tool_choice — it does support naming a specific tool, not just gating whether any tool is called.
Why-B: tool_choice is a request parameter that directly constrains what the model can respond with on that turn; it isn't a passive client-side setting with no effect on tool selection.
Why-C: Once the forced named tool_choice is in place for that turn, it deterministically guarantees get_customer runs — the prompt instruction becomes redundant for enforcement purposes on that step, not still load-bearing.
Why-D: Correct — a forced named tool_choice is precisely the mechanism for guaranteeing a specific mandatory first step, replacing an instruction the model was following only probabilistically.
Source: Lesson 2.3 — Tool Distribution & Tool Choice

## Q23
Correct: C
Explanation: The migration has multiple valid approaches across varying call sites and touches many files — exactly the ambiguity-and-scope profile that calls for plan mode first, then execution file-by-file against the agreed approach — while the pagination fix is a single, well-scoped, known change suited to direct execution regardless of user-facing impact.
Why-A: This gets the assignment backward — plan mode is for the ambiguous, multi-file migration, not the single well-scoped pagination fix, and "affects user-facing behavior" isn't the documented criterion (ambiguity and scope are).
Why-B: Treating the migration's varying call-site patterns as uniformly mechanical ignores that some call sites need materially different changes — exactly the kind of multi-approach ambiguity plan mode is meant to resolve before touching 45 files.
Why-C: Correct — this is the documented hybrid pattern: plan mode agrees the approach for a multi-file, multi-pattern migration, then direct execution proceeds file-by-file; the single-approach pagination fix goes straight to direct execution.
Why-D: Using plan mode for every multi-step task regardless of ambiguity over-applies it to the pagination fix, which is small, well-scoped, and has one clear approach.
Source: Lesson 3.4 — Plan Mode vs Direct Execution

## Q24
Correct: C
Explanation: A naive retry that just repeats the same prompt doesn't give the model any new information to work with; the documented fix is retrying with the original input, the failed output, and the specific validation error, so the model can self-correct instead of guessing again — this is a semantic error, not something a stricter schema alone can catch.
Why-A: A regex on the assertion field could catch some syntax patterns, but it doesn't verify the assertion is semantically correct for the function's actual behavior — the underlying problem the schema already can't catch.
Why-B: Temperature affects general variability but gives the model no actual feedback about what was wrong with the previous attempt; it's not the documented retry mechanism.
Why-C: Correct — feeding back the original function, the failed stub, and the specific mismatch is exactly the guide's retry-with-feedback approach for recoverable semantic errors.
Why-D: Moving to batch processing doesn't fix the content of any individual attempt, and batch is documented as unsuited to this kind of blocking, pre-merge CI workflow in the first place.
Source: Lesson 4.4 — Validation & Retry Loops

## Q25
Correct: C
Explanation: An aggregate accuracy figure can hide much weaker performance in specific segments; the guide's practice is to validate by segment (here, claim type) before reducing human review, keeping review in place for segments that validate poorly like the 71%-accurate shipping-damage claims.
Why-A: Trusting the 97% aggregate is exactly the documented trap — it hides the 71% accuracy on shipping-damage claims, a segment that would then go unreviewed despite being far riskier.
Why-B: This inverts the correct logic entirely — the worse-performing segment needs more scrutiny, not less, regardless of its share of volume.
Why-C: Correct — validating and deciding review levels by segment (claim type) is the documented practice; segments that validate well can see reduced review, while poorly-validating segments like shipping-damage keep it.
Why-D: A larger sample might refine the 97% figure's precision, but recomputing the same aggregate metric still hides the segment-level gap — the fix is segmenting the analysis, not resampling the same aggregate.
Source: Lesson 5.5 — Human Review & Confidence Calibration

## Q26
Correct: B
Explanation: A "never do X without asking" requirement for a destructive, hard-to-reverse action is exactly the "must never" case the guide says needs deterministic enforcement — a PreToolUse hook that can actually block or redirect the call — rather than any form of prompt-based instruction, however it's worded or where it's placed.
Why-A: Moving the same prompt instruction into a path-specific rule still leaves it as a probabilistic prompt-level guideline; it doesn't add any enforcement the agent can't bypass.
Why-B: Correct — a PreToolUse hook is the one mechanism that can deterministically block or redirect the destructive command before it ever executes, matching the guide's "must never" enforcement rule.
Why-C: Few-shot examples improve consistency for judgment calls and formatting, not for guaranteeing a hard "never" requirement — the agent can still deviate under an unusual sequence of events.
Why-D: Stronger wording and placement still leave the safeguard entirely in the probabilistic prompt layer; it doesn't change the actual guarantee, since CLAUDE.md instructions were never designed to enforce anything deterministically.
Source: Lesson 1.4 — Workflow Enforcement & Handoff

## Q27
Correct: A
Explanation: A server the whole team needs belongs in project scope (.mcp.json, committed to version control) rather than a single engineer's personal user scope, and secrets referenced through it should use environment-variable expansion rather than being hard-coded into a config file.
Why-A: Correct — .mcp.json gives every teammate the server automatically, and ${GITHUB_TOKEN} expansion keeps the actual secret out of version control while still letting the shared config reference it.
Why-B: Even with identical JSON, keeping it in each personal ~/.claude.json still requires manual setup per teammate and doesn't solve the "not shared automatically" problem — it also perpetuates hard-coded tokens.
Why-C: This still routes every new teammate through manual, individual token hard-coding rather than fixing the underlying scope problem, and hard-coded tokens shouldn't be in any config file, personal or shared.
Why-D: Standard GitHub integration used by the whole team for repo automation is exactly the kind of shared tooling the guide says belongs in project scope, not something to leave as an individual preference.
Source: Lesson 2.4 — Integrating MCP Servers

## Q28
Correct: D
Explanation: The right split is one message for issues that interact with each other (so they're reconciled coherently as a set) and separate, sequential delivery for issues that are independent — not a blanket rule of always-sequential or always-batched regardless of how the issues relate.
Why-A: Always going sequential regardless of interaction risks fixing the renamed function first without letting Claude account for the call site and type signature that must change together in the same edit.
Why-B: Always batching regardless of interaction dumps the fully unrelated unused-import fix into the same message as a set of changes it has nothing to do with, adding noise without benefit.
Why-C: Bundling an unrelated issue in with an interacting set doesn't help Claude reconcile the interacting ones and adds an unrelated concern to the same message for no reason.
Why-D: Correct — batching the three interacting issues together lets Claude reconcile them as one coherent change, while the independent unused-import fix is cleanly handled on its own.
Source: Lesson 3.5 — Iterative Refinement Techniques

## Q29
Correct: D
Explanation: Retries only fix recoverable errors where the correct answer is derivable from the input; when a field is genuinely absent from the source, no amount of retrying can produce it correctly, and repeated attempts instead pressure the model toward fabricating a plausible-looking value — the fix is to stop retrying and route to null/human review.
Why-A: More retries against a document that never contains the value doesn't create the information — it only increases the risk of fabrication, exactly what happened by the fifth attempt.
Why-B: Lower temperature might make outputs more consistent, but consistently wrong (or consistently fabricated) isn't the goal — it doesn't address the fact that the value was never in the source at all.
Why-C: An anti-fabrication instruction is reasonable general prompt hygiene, but it doesn't change the fact that repeatedly retrying an unrecoverable absence is the wrong response — the loop itself needs to stop, not just be worded more carefully.
Why-D: Correct — recognizing the absence is unrecoverable by retrying and routing to null/human review is exactly the guide's fix for information that was never in the source to begin with.
Source: Lesson 4.4 — Validation & Retry Loops

## Q30
Correct: D
Explanation: When credible sources report different values, the fix isn't to silently pick one (by recency or otherwise) or average them — it's to preserve both with attribution and dates, and use the dates to recognize the difference could be a real trend across time rather than a conflict to resolve.
Why-A: Averaging two figures from different years and different document types treats them as if they measure the same thing at the same time, manufacturing a number neither source actually reported.
Why-B: Recency alone silently discards the audited statement's figure and presents an unverified deck projection as settled fact, exactly the anti-pattern of arbitrarily picking a winner.
Why-C: Discarding the investor deck entirely swaps one arbitrary winner for another instead of preserving both figures with their context.
Why-D: Correct — preserving both figures with attribution and dates, and recognizing the 2024-to-2026 gap could reflect genuine growth, is exactly the guide's approach to differently-dated financial figures.
Source: Lesson 5.6 — Information Provenance & Multi-Source Synthesis

## Q31
Correct: C
Explanation: A request bundling several concerns should be decomposed into distinct items, each investigated, then synthesized into one unified reply — not handled one at a time while the rest get dropped, deferred back to the customer, or escalated wholesale.
Why-A: Pushing the decomposition work onto the customer contradicts the point of a resolution agent handling multi-concern requests in one pass.
Why-B: Resolving only the highest-priority concern and telling the customer to follow up again is exactly the "handling one and dropping the rest" pattern the guide says to avoid.
Why-C: Correct — decomposing into distinct concerns, investigating each, and synthesizing one unified resolution is exactly the documented approach for a bundled request.
Why-D: Escalating the whole message is unnecessary — none of the three concerns individually requires human judgment, and the agent has tools to address all three itself.
Source: Lesson 1.4 — Workflow Enforcement & Handoff

## Q32
Correct: B
Explanation: Glob matches file names and paths, not file contents; finding every reference to a constant used inside files requires Grep, which searches contents — Glob was the wrong tool for this from the start regardless of the exact pattern used.
Why-A: Broadening the Glob pattern still only ever matches file names/paths; a constant referenced inside file contents will never surface through Glob no matter how the wildcard is written.
Why-B: Correct — Grep searches file contents, which is exactly where a referenced constant name lives; this is the documented distinction between the two tools.
Why-C: Reading every file up front floods context and is explicitly the anti-pattern the guide warns against — incremental Grep-then-Read discovery is the documented approach instead.
Why-D: Manually maintaining a separate tracking file duplicates what Grep already finds directly and adds an artifact that will drift out of date.
Source: Lesson 2.5 — Selecting Built-in Tools

## Q33
Correct: B
Explanation: Degrading review quality across many items in a single pass is attention dilution — a finite-attention problem, not a context-size one — so a bigger window doesn't fix it; the documented cure is multi-pass review, splitting into per-file passes plus a separate integration pass for cross-file issues.
Why-A: The guide explicitly rejects a bigger model or context window as the fix for attention dilution — the cause is finite attention, not capacity.
Why-B: Correct — this names both the correct diagnosis (attention dilution, not context size) and the documented fix (per-file passes plus a cross-file integration pass).
Why-C: A stricter iteration cap addresses runaway loops, not the quality of attention paid to each file in a single overloaded pass — it doesn't touch the actual cause.
Why-D: Splitting the PR itself might help in some workflows, but it isn't the guide's documented fix for attention dilution and puts the burden on the developer rather than fixing the review strategy; multi-pass review is the intended mechanism.
Source: Lesson 1.6 — Task Decomposition Strategies

## Q34
Correct: A
Explanation: custom_id exists precisely to correlate each response to its original request, so a partial batch failure should be handled by resubmitting only the failed custom_ids after fixing the underlying issue — not by resubmitting everything or abandoning batch for a job that's genuinely latency-tolerant.
Why-A: Correct — using custom_id to isolate exactly the 60 failed requests and resubmitting only those is the documented cost-effective practice for partial batch failures.
Why-B: Resubmitting all 1,000 wastes cost and time on the 940 that already succeeded; the failures were tied to malformed diffs, not evidence of a systemic issue affecting successful requests.
Why-C: A latency-tolerant weekly audit is exactly the workload the Batch API is suited for; a batch of 1,000 having 60 recoverable failures doesn't mean the API can't be trusted for this workload.
Why-D: The 24-hour figure is the batch window's outer bound, not a required waiting period, and simply re-running the full batch again doesn't fix the malformed-diff issue causing those 60 failures.
Source: Lesson 4.5 — Batch Processing Strategies

## Q35
Correct: D
Explanation: For hooks, the exit-code contract is specific: exit 0 allows, exit 2 blocks, and any other non-zero code — including 1 — is a non-blocking error, so a hook exiting 1 never actually stops the command from running.
Why-A: PreToolUse is exactly the hook type capable of blocking — it fires before the tool runs and is the "only chance to stop it" — so this reverses the correct timing.
Why-B: PostToolUse fires after the tool has already run, and is meant for reshaping results, not for preventing execution — moving the check there would make blocking impossible, not fix it.
Why-C: JSON with "decision": "block" is a valid alternative mechanism for communicating a block, but exit codes remain a valid mechanism too — exit 2 specifically does block; the two mechanisms just shouldn't be mixed together.
Why-D: Correct — exit 2 is the only exit code that blocks; exit 1 is treated as a non-blocking error, which is exactly why the command still ran.
Source: Lesson 1.5 — Agent SDK Hooks

## Q36
Correct: B
Explanation: -p (or --print) is the documented, actual mechanism for running Claude Code non-interactively in CI — it processes the prompt, prints the result, and exits without waiting for input; CLAUDE_HEADLESS and --batch are not real flags, and a stdin redirect is a workaround rather than the documented fix.
Why-A: CLAUDE_HEADLESS is not a real Claude Code environment variable — it's a plausible-sounding but fake flag.
Why-B: Correct — -p/--print is explicitly documented as the fix for a CI job hanging on input, running Claude Code non-interactively end to end.
Why-C: --batch is not a real Claude Code flag; it's a distractor invoking a different, unrelated API concept (the Message Batches API) by name association.
Why-D: Redirecting stdin might incidentally avoid a hang in some cases, but it's a workaround, not the documented, reliable fix for the hanging behavior across every pipeline run.
Source: Lesson 3.6 — Integrating Claude Code into CI/CD

## Q37
Correct: B
Explanation: Self-review within the same session stays biased toward confirming its own generation reasoning no matter how the validation prompt is worded, because that reasoning is still present in context; the documented fix is an independent instance with no prior context, which has no generation reasoning to defend.
Why-A: A "be critical" instruction doesn't remove the biasing generation reasoning still sitting in the same session's context — the guide explicitly notes in-session instructions don't fix this.
Why-B: Correct — an independent instance with no prior context is the documented fix; same-session prompting, however worded, doesn't remove the confirmation bias.
Why-C: Extended thinking within the same biased session still reasons from the same generation context already in that session; it's explicitly called out as not removing the confirmation bias either.
Why-D: A bigger context window doesn't address confirmation bias from the model's own generation reasoning being present — that's a different problem (attention dilution) from self-review bias.
Source: Lesson 4.6 — Multi-Instance & Multi-Pass Review

## Q38
Correct: A
Explanation: Normalizing heterogeneous tool output into a consistent format is a deterministic transform that belongs in a PostToolUse hook — reshaping the result before the model sees it — rather than in the prompt, which is probabilistic and wastes tokens on a mechanical task the model can get subtly wrong.
Why-A: Correct — this is exactly the guide's PostToolUse normalization case: Unix, ISO, and locale-formatted dates should be converted deterministically in a hook before the model reasons over them.
Why-B: Even a well-defined transformation asked of the model in the prompt remains probabilistic — it can still misconvert or skip the conversion on some fraction of turns, which is exactly the unreliable behavior already observed.
Why-C: A PreToolUse hook fires before the tool runs and is for blocking/redirecting calls, not for reshaping data the tool already returned — blocking every non-ISO date response would also break the tools entirely rather than fix the format.
Why-D: Worked examples can improve a judgment-based prompt task, but this is a mechanical, deterministic transform where the guide's fix is removing it from the probabilistic prompt layer entirely, not making the prompt version more detailed.
Source: Lesson 1.5 — Agent SDK Hooks

## Q39
Correct: A
Explanation: A session that just generated the code is weaker at reviewing it because it retains and tends to confirm its own generation reasoning; the fix is a separate, independent instance with no prior context, exactly as the guide recommends for CI review and applies equally to this interactive workflow.
Why-A: Correct — an independent instance with no prior context has no generation reasoning to confirm, and is the documented fix for exactly this same-session review weakness.
Why-B: A second pass in the same biased session still carries forward the same generation reasoning that caused it to overlook the issues the first time.
Why-C: Extended thinking within the same session doesn't remove the session's confirmation bias toward its own prior work — the bias comes from the context it's reasoning over, not the depth of reasoning applied to it.
Why-D: A larger context window addresses capacity, not the confirmation bias driving a session to under-scrutinize its own generated code.
Source: Lesson 3.6 — Integrating Claude Code into CI/CD

## Q40
Correct: C
Explanation: fork_session branches from the conversation's current state, so it inherits the same stale cached policy lookup as the original — it isn't a fix for stale context, only for exploring a divergent approach from a shared, still-valid baseline; the actual fix is a fresh session with a structured summary and an explicit pointer to what changed, prompting targeted re-reading.
Why-A: Forking doesn't purge anything from the branched conversation state — it copies the conversation, stale data included.
Why-B: Forking is explicitly not a blank-context operation; it branches the existing conversation, carrying forward exactly the stale lookup the engineer is trying to escape.
Why-C: Correct — this matches the documented stale-context fix precisely: a fresh session, a structured summary, and naming what specifically changed so the session re-reads only that instead of trusting cached results.
Why-D: /compact summarizes conversation history to save space, but the resumed session's stale cached policy lookup remains the same stale fact — compacting doesn't refresh it or make the session aware the underlying policy changed.
Source: Lesson 1.7 — Session State, Resumption & Forking
