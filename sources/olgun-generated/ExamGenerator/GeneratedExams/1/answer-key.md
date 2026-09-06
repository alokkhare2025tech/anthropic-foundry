## Q1
Correct: B
Explanation: The walkthrough is an occasional, verbose procedure — exactly what skills are for, and `context: fork` keeps its heavy intermediate output from polluting the main session's context.
Why-A: CLAUDE.md is always-on context loaded into every session; a rarely-used verbose procedure there wastes context on sessions that never invoke it.
Why-B: Correct — skills load on demand rather than always-on, and `context: fork` runs the verbose walkthrough in an isolated subagent so its output doesn't pollute the main conversation.
Why-C: Personal command scope means only that one engineer can use it, and it still doesn't isolate the verbose output from the main context.
Why-D: A PreToolUse hook fires automatically before tool calls; it's not an on-demand, invokable procedure and doesn't address context isolation.
Source: Lesson 3.2 — Custom Slash Commands & Skills

## Q2
Correct: D
Explanation: A coverage gap where whole regions are barely mentioned is a decomposition failure — the coordinator never assigned those regions to any subagent — so the fix is reviewing and correcting the decomposition, not blaming or augmenting the workers.
Why-A: A fact-checking agent verifies claims already made; it doesn't address topics the decomposition never assigned anyone to research.
Why-B: Direct agent-to-agent communication removes the coordinator's controlled information flow and observability without addressing the actual missing-assignment cause.
Why-C: Asking the synthesis agent to self-flag gaps blames the worker for a coverage decision it was never responsible for making.
Why-D: Correct — the signature failure is a decomposition gap; reviewing the coordinator's logs and fixing the task breakdown so all three regions are explicitly assigned addresses the root cause.
Source: Lesson 1.2 — Multi-Agent Orchestration

## Q3
Correct: C
Explanation: A high false-positive rate in one category erodes trust across all categories; the fix is to temporarily disable the noisy category and rewrite it with explicit, verifiable criteria rather than adjusting a confidence threshold or vague prose.
Why-A: Leaving a 40%-FP category active continues eroding trust in every other category while the fix is worked on.
Why-B: Model self-confidence is poorly calibrated, so raising a confidence threshold is a weak primary fix and still leaves confident errors passing through.
Why-C: Correct — disabling the problematic category while refining its criteria with explicit, verifiable rules restores trust in the other categories and fixes the root cause rather than a symptom.
Why-D: This is still a vague, prose-based instruction with no explicit decision boundary — the same class of problem that caused the false positives.
Source: Lesson 4.1 — Prompts with Explicit Criteria

## Q4
Correct: C
Explanation: Misrouting between look-alike tools is a tool-description problem; the highest-leverage fix is an explicit "use X NOT Y" boundary line plus clear input/purpose descriptions, not few-shot examples, bigger models, or consolidation.
Why-A: A bigger model doesn't fix an ambiguous tool boundary, and removing data from a tool changes its capability rather than clarifying selection.
Why-B: Few-shot examples add prompt overhead and are not the most effective first step when the root cause is inadequate descriptions.
Why-C: Correct — rewriting both descriptions with purpose, inputs, and an explicit "use `lookup_order` NOT `get_customer`" boundary is the lowest-effort, most effective fix for misrouting between similar tools.
Why-D: Merging into one tool is more effort than a first step warrants and can reintroduce the same ambiguity inside a single tool's input handling.
Source: Lesson 2.1 — Designing Tool Interfaces

## Q5
Correct: B
Explanation: Progressive summarization destroys transactional specifics like amounts, dates, and IDs; the reliable fix is a persistent case-facts block carried in every prompt, outside the summarized history, so those facts survive regardless of how the rest is trimmed.
Why-A: Never summarizing defeats the purpose of context management and doesn't scale as the conversation grows.
Why-B: Correct — extracting transactional facts into a persistent, never-summarized case-facts block preserves exactly the details progressive summarization destroys.
Why-C: A stronger prose instruction to "preserve all important details" is still probabilistic guidance and doesn't reliably survive repeated summarization passes.
Why-D: A bigger context window doesn't stop summarization from destroying specifics; the problem is what summarization does to facts, not available space.
Source: Lesson 5.1 — Managing Conversation Context

## Q6
Correct: D
Explanation: Degrading quality on middle items despite documents individually fitting the context window is attention dilution from handling too many items in one pass, not a capacity problem — the fix is per-document passes plus a separate integration pass.
Why-A: Attention dilution is caused by finite attention across many items in one pass, not context size, so a bigger window does not fix it.
Why-B: More emphatic prose doesn't change the underlying attention-dilution mechanism across many items in a single pass.
Why-C: Reducing sources sacrifices coverage instead of fixing the actual quality problem, which is how the pass is structured.
Why-D: Correct — splitting into per-document (or per-batch) passes plus a separate cross-document integration pass directly addresses attention dilution.
Source: Lesson 1.6 — Task Decomposition Strategies

## Q7
Correct: A
Explanation: When prose is being interpreted inconsistently and is hard to specify further in words, 2-3 concrete input/output examples communicate the expected transformation more reliably than more prose.
Why-A: Correct — concrete examples show the exact tone and format expected, resolving inconsistency that more prose description couldn't fix.
Why-B: The interview pattern surfaces missing considerations in unfamiliar domains; here the team already knows what it wants but struggles to describe it in words — examples fit better.
Why-C: This is still a vague prose instruction, the same category of fix that already failed to produce consistent output.
Why-D: Plan mode is for agreeing architecture before implementation; it doesn't address output-format consistency in a generation step.
Source: Lesson 3.5 — Iterative Refinement Techniques

## Q8
Correct: C
Explanation: For a high-frequency, simple cross-role need, give the agent a narrow scoped tool for that common case and reserve coordinator routing for the rarer complex cases, avoiding both over-provisioning and unnecessary latency.
Why-A: Giving the full `web_search` tool over-provisions the synthesis agent for a task it should only do narrowly, risking misuse and duplicated work.
Why-B: Routing every simple check through the coordinator for the common case adds unnecessary hops and latency for no added benefit.
Why-C: Correct — a scoped `verify_fact` tool handles the frequent simple case directly while the coordinator still handles the rarer complex cases.
Why-D: A dedicated fact-checking subagent adds coordination overhead for what is a simple, high-frequency check better solved with a scoped tool.
Source: Lesson 2.3 — Tool Distribution & Tool Choice

## Q9
Correct: B
Explanation: Marking a maybe-absent field required pressures the model to fabricate a value; making it optional/nullable lets the model return an honest null when the source doesn't contain the data.
Why-A: Removing the field entirely loses the ability to capture the date when it is present in other emails.
Why-B: Correct — making the field nullable removes the pressure to fabricate a plausible-looking date when the source doesn't state one.
Why-C: A prompt instruction not to guess is a probabilistic nudge; it doesn't remove the structural pressure created by a required field's schema constraint.
Why-D: Switching away from a forced tool choice reintroduces the risk of unstructured text output instead of fixing the actual cause, which is the required field.
Source: Lesson 4.3 — Structured Output with Tool Use

## Q10
Correct: D
Explanation: A 5%-of-the-time ordering failure with financial consequences needs a deterministic guarantee, not probabilistic prompting — a programmatic prerequisite gate in code is the only mechanism that enforces the lookup-before-refund order every time.
Why-A: A system-prompt instruction is probabilistic guidance — a sign, not a lock — and won't reach 100% compliance for a financial ordering requirement.
Why-B: Few-shot examples still rely on the model choosing to follow the pattern; they don't guarantee the order every time.
Why-C: A routing classifier addresses whether a request looks eligible, not whether the tools are called in the required order, and doesn't provide a deterministic guarantee.
Why-D: Correct — a programmatic prerequisite gate blocking `process_refund` until `lookup_order` has succeeded is the deterministic enforcement this financial-guarantee requirement calls for.
Source: Lesson 1.4 — Workflow Enforcement & Handoff

## Q11
Correct: A
Explanation: When credible sources conflict, preserve both values with their attribution and dates rather than picking a winner — the difference between January and May figures may reflect a genuine trend rather than a contradiction.
Why-A: Correct — annotating both figures with source and date lets the report distinguish a possible trend from a true contradiction, rather than silently resolving the conflict.
Why-B: Always deferring to the most recent source discards a credible data point and can misrepresent a trend as if the earlier figure were simply wrong.
Why-C: Averaging two dated figures manufactures a number neither source actually reported and hides the real story (a change over time).
Why-D: Omitting the figure entirely discards genuinely useful information that could be reported accurately with proper attribution.
Source: Lesson 5.6 — Information Provenance & Multi-Source Synthesis

## Q12
Correct: A
Explanation: A server the whole team needs belongs in project-scoped `.mcp.json` committed to version control, with secrets referenced via environment-variable expansion rather than hard-coded, so the config is shared without leaking the token.
Why-A: Correct — moving the server to `.mcp.json` makes it available to the whole team, and `${API_TOKEN}` expansion keeps the actual secret out of the committed config.
Why-B: Keeping it user-scoped still means the rest of the team can't use the server; rotating a hard-coded token doesn't fix the exposure or the sharing problem.
Why-C: Moving it to `.mcp.json` fixes sharing, but leaving the token hard-coded commits the secret to version control since `.mcp.json` is intended to be shared, not local-only.
Why-D: Staying user-scoped doesn't solve the team-sharing problem, and wrapping a hard-coded token in a resource doesn't address the secret being exposed.
Source: Lesson 2.4 — Integrating MCP Servers

## Q13
Correct: B
Explanation: A session that generated the code is weaker at reviewing it because it retains and confirms its own generation reasoning; the fix is a separate `claude -p` review invocation with no prior context.
Why-A: More turns for the same session doesn't remove its bias toward confirming code it already believes is correct.
Why-B: Correct — invoking a separate `claude -p` review with no prior context avoids the self-review bias that let the off-by-one error through.
Why-C: Asking the same biased session to "be more critical" doesn't remove the underlying bias from having generated the code itself.
Why-D: The output format (JSON vs text) is unrelated to the self-review bias that caused the missed error.
Source: Lesson 3.6 — Integrating Claude Code into CI/CD

## Q14
Correct: D
Explanation: Backend data the investigation depends on has changed, so this is the stale-context trap: resuming or forking both inherit the same stale results, while a fresh session with a structured summary naming the changed systems allows targeted re-querying of only what changed.
Why-A: `--resume` reopens the session with its full history intact, including now-stale backend results the agent would keep reasoning from.
Why-B: Forking copies the current conversation state, so the new branch still inherits the same stale results from before the pipeline fix.
Why-C: Asking the agent to "ignore" prior results doesn't remove the stale data from context, which can still conflict with newly-fetched results.
Why-D: Correct — a fresh session with a structured summary of the case, naming which backend systems changed, lets the engineer re-query only the affected systems instead of carrying stale results forward.
Source: Lesson 1.7 — Session State, Resumption & Forking

## Q15
Correct: C
Explanation: A math mismatch is a recoverable semantic error the model can fix given the original log and the specific validation error, while a value genuinely absent from the source (missing file) should be flagged for human review or nulled, not retried.
Why-A: The mismatch is a semantic error, not a JSON syntax error, so schema validation alone won't catch or fix it; retrying the missing file risks fabricating a coverage figure that isn't in the source.
Why-B: An unchanged naive retry repeats the same mistake for the mismatch and can't invent data that was never logged for the missing file.
Why-C: Correct — retrying the mismatched percentage with the log, the failed extraction, and the specific error lets the model recompute it; the missing file has no data to retry toward, so it should be nulled or flagged.
Why-D: Ignoring the mismatch leaves a real semantic error uncorrected, and retrying for genuinely absent data risks fabrication rather than surfacing the gap.
Source: Lesson 4.4 — Validation & Retry Loops
