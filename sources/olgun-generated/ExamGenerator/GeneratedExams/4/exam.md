# Exam 4

Title: CCAR-F Practice Exam 4 — Maximum Difficulty Edition
Total: 20

## Q1
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.1 Designing Tool Interfaces
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

The productivity agent has a custom MCP tool deploy_service whose target_env argument must be exactly one of "staging", "canary", or "prod-us East" — matching the legacy deploy system's odd casing and hyphenation precisely — and whose rollback_ticket argument is required only when target_env is "prod-us East". Engineers keep calling deploy_service with target_env="production" or omitting rollback_ticket on prod deploys, causing failed deploys, while a separate .claude/skills/deploy-runbook/SKILL.md already documents the human runbook for handling a failed deploy (rollback steps, who to page, which Slack channel) and is invoked on demand via /deploy-runbook after something goes wrong. An engineer proposes fixing the argument problem by adding the exact accepted target_env values and the conditional rollback_ticket rule into deploy-runbook's SKILL.md, reasoning "SKILL.md is already where we document how Claude should behave around deploys." Given that whichever fix is chosen must actually be consulted by Claude on every deploy_service call — not just when something has already gone wrong — is the engineer's proposal correct?

A) Yes — SKILL.md already documents deploy procedures for Claude, so adding the accepted target_env values and the conditional rollback_ticket rule to its body will make subsequent deploys follow them
B) No — a skill's SKILL.md loads only when the skill is explicitly invoked, so the argument rules belong in deploy_service's own tool description and input schema instead
C) No — the accepted values and the rollback_ticket condition belong in the project's root CLAUDE.md instead, since that file is always loaded into context on every session regardless of skill invocation
D) Yes — provided the deploy-runbook skill also sets context: fork, so its argument rules run in an isolated pass ahead of each deploy_service call rather than only after a failure

## Q2
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.1 Designing Agentic Loops
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, and account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human. The company operates under a compliance mandate that every refund and account change be auditable after the fact, while the support team is separately measured on first-contact resolution speed.

The harness ends the agent's turn whenever its response contains the literal marker text "FINAL ANSWER:" anywhere in a text block, on the theory that the model uses that phrase only once it is truly done, and the compliance audit logger writes an entry only when a tool_result is appended to the conversation. During a billing dispute, the model's response reads "Let me draft what will become my FINAL ANSWER: once the refund posts," immediately followed by a queued process_refund tool_use block — the harness sees the marker, ends the turn on the spot, and the audit log ends up with no record that process_refund ever ran. What should the harness check instead to decide the turn is complete, so every executed tool call is reliably audit-logged?

A) The response's stop_reason field — keep looping and execute any queued tool_use blocks for as long as it reads "tool_use", and treat the turn as complete only once it reads "end_turn"
B) The marker's position rather than its presence — require "FINAL ANSWER:" to be the response's final token, and end the loop only when the marker is present and trailing every other block
C) Both, in sequence — keep the marker check as the primary signal, and whenever the harness notices it skipped a queued tool_use block, append a synthetic audit-log tool_result to backfill the entry
D) The response text after a cleanup pass — add a PostToolUse hook that scans each response and strips the marker out, so a stray conversational phrase can never end the turn early

## Q3
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.1 Prompts with Explicit Criteria
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

Over the last month, the CI bot's "security" review category has run an 80% false-positive rate, and reviewers have started skimming past its findings entirely; its "performance" category sits at a 25% false-positive rate, and reviewers still read and act on its findings often enough that it's clearly providing value. The team wants one policy for both categories they can apply on a fixed weekly cadence rather than deciding case by case. Given the very different severity of the two false-positive rates and how differently reviewers are already treating each category, what should the team do?

A) Disable both categories until each is rewritten with explicit report/skip criteria and worked examples, holding security and performance to the same standard since any false-positive rate above zero erodes reviewer trust
B) Disable security while its criteria are rewritten with explicit examples, and keep performance running while tightening its criteria incrementally, since reviewers have tuned out one category but not the other
C) Raise the self-reported confidence threshold for security only and leave performance untouched, since a threshold change ships in an afternoon where rewriting criteria takes a full cycle
D) Keep both categories running and attach a disclaimer to every comment stating its category's measured false-positive rate, since even a temporary gap in coverage risks missing a genuine security issue

## Q4
Domain: 5. Context Management & Reliability
Subtopic: 5.1 Managing Conversation Context
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, and account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human. The company operates under a compliance mandate that every refund and account change be auditable after the fact, while the support team is separately measured on first-contact resolution speed.

A ticket covers both a refund dispute ($642.18 against invoice INV-7734) and a separate delayed shipment (promised delivery 2026-07-18, now twelve days overdue). The team already added something they call a "case facts" block to protect exact figures through summarization, but it's implemented as a single free-text field — summary: "customer has a refund issue and a shipping delay" — that gets regenerated by the same summarizer on every pass, and the exact dollar amount, invoice ID, and delivery date are still getting lost after a few rounds of summarization. What is actually wrong with their implementation, and what should case facts be instead?

A) Nothing is structurally wrong with a single free-text field; the summarization pass should simply run less often, so the case-facts block is regenerated fewer times over a long dispute
B) The block is still inside the lossy process; case facts must be structured fields — refund_amount, invoice_id, promised_delivery_date — populated once from source data and excluded from summarization entirely
C) The block is fine as free text but under-instructed; the summarizer's own prompt should enumerate every figure, invoice ID, and date it must carry forward untouched on each pass
D) The block is stale rather than lossy; case facts should be recomputed at each compaction, re-deriving the figures from the original lookup_order and process_refund tool results every time

## Q5
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.4 Workflow Enforcement & Handoff
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

A PreToolUse hook already blocks any Bash command matching destructive git patterns (git push --force, git reset --hard) against main, redirecting to a human-confirmation step, and it works reliably. The on-call team complains that during a genuine production incident, waiting for the confirmation step's normal turnaround costs several minutes they can't spare, and someone proposes letting the agent bypass the hook whenever it judges the situation urgent, by including the literal string "#emergency-override" in its own Bash command. Should the team adopt this, and if not, what should they do instead?

A) Yes — the agent's read on urgency is a reasonable signal during an incident, and the override string leaves a lightweight audit trail of its own since it shows up in the shell history
B) No — remove the hook's main-branch pattern during business hours instead, since destructive commands issued inside working hours are nearly always deliberate and already visible to a reviewing colleague
C) No — a self-issued override returns the decision to the agent's own judgment; give the human confirmation step an expedited path instead, such as a pre-authorized on-call approver
D) Yes — but only alongside a hook change that logs every use of the override string, so on-call keeps its seconds and every bypass stays reviewable after the incident closes

## Q6
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.1 CLAUDE.md Hierarchy & Scoping
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

The root CLAUDE.md states "Bash commands touching infra/ must be dry-run first (--dry-run) before actual execution," while a directory-level infra/terraform/CLAUDE.md states "terraform commands in this directory may apply directly without --dry-run, because this environment is sandboxed and disposable." Engineers assumed the directory-level file simply overrides root, so agents working in infra/terraform stopped dry-running — but the sandbox was recently connected to a shared network route to a staging database, so "disposable" is no longer accurate, and nobody has updated the file yet. Setting aside the outdated content for a moment, is the team's "directory file overrides root" mental model itself correct, and what should actually happen here?

A) The mental model is correct — a directory-level CLAUDE.md takes precedence over root for its subtree, so the one fix needed is editing infra/terraform/CLAUDE.md to drop the "may apply directly" language now that the sandbox is networked
B) The mental model is wrong — only root CLAUDE.md is loaded when a Bash command targets a subdirectory, since directory-level files scope to Read, Edit, and Write operations rather than to Bash execution
C) The mental model is correct in general but inapplicable here, because a dry-run safety requirement is one of the instruction types no directory-level file can override, whatever that file happens to say
D) The mental model is wrong — CLAUDE.md files concatenate rather than override, so both instructions are live at once; resolve the contradiction directly, correct the stale "disposable" claim, and confirm with /memory

## Q7
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.2 Structured Error Responses
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, and account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human. The company operates under a compliance mandate that every refund and account change be auditable after the fact, while the support team is separately measured on first-contact resolution speed.

process_refund currently returns the identical error text — "ledger mismatch, refund not applied" — whether the cause is transient replica lag between two backend ledgers (should retry) or a genuine reconciliation discrepancy (should never retry, must escalate), and that same text is shown to the customer verbatim, which support policy prohibits. Compliance separately requires the exact technical cause be captured in an internal audit log on every failure. What should process_refund's error response be changed to provide?

A) An errorCategory field separating "transient" from "business", a retryAfter hint for the transient case, and the existing error text retained unchanged for both the audit log and the customer-facing message
B) An isRetryable boolean defaulting to true, plus an attemptCount the agent increments, so it retries a bounded number of times whatever the underlying cause and escalates only once those attempts are exhausted
C) An errorCategory ("transient" vs. "business"), an isRetryable flag derived from that category, a technical message carrying the exact cause for the audit log, and a separate policy-approved userFacingMessage
D) The raw ledger replica ID that served the request plus both ledgers' last-sync timestamps, so the agent can judge locally whether the mismatch was likely replica lag and therefore worth retrying

## Q8
Domain: 5. Context Management & Reliability
Subtopic: 5.3 Error Propagation in Multi-Agent Systems
Scenario: Multi-Agent Research System

A multi-agent research system built on the Claude Agent SDK uses a coordinator agent that delegates to specialized subagents — one searches the web, one analyzes documents, one synthesizes findings, and one generates reports — to produce comprehensive, cited reports for clients on tight publication deadlines. Every claim in a final report must be traceable to a specific source, and the research team is also expected to reuse prior sessions' work rather than re-researching from scratch.

With the publication deadline one hour away, a web-search subagent is midway through gathering eight planned sources when it hits a rate-limit error on the sixth — it already has five sources fully fetched and verified in hand. What should it report back to the coordinator?

A) The five verified sources with their findings intact, plus a structured note that sources six through eight went unattempted because of a rate limit, leaving the coverage decision to the coordinator
B) {"findings": [], "status": "failed"}, so the coordinator treats this subagent's pass as untrustworthy in full and decides for itself whether to restart the whole eight-source search inside the hour remaining
C) {"findings": [the five sources' findings], "status": "complete"}, since five verified sources support a credible report and raising a shortfall this close to the deadline would only alarm the coordinator
D) Nothing yet — retry sources six through eight locally across the rate limit's cooldown without spending the coordinator's attention on a routine transient issue, then report once all eight are gathered

## Q9
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.4 Plan Mode vs Direct Execution
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

A CI-triggered Claude Code fix is needed for two flaky tests with the release train's deploy window closing in ten minutes: one failure traces to a single test file's hardcoded local-timezone assumption, a well-scoped, single-approach fix; the other traces to a shared assertion-helper library used by 60 test files, where a correct fix requires choosing among three materially different valid refactor approaches with different downstream false-positive implications. Given the ten-minute window, should time pressure push the shared assertion-helper fix to direct execution as well, alongside the already-appropriate direct execution of the timezone fix?

A) Yes — a hard ten-minute window makes plan mode's proposal-and-approval overhead unaffordable regardless of how ambiguous a fix is, so both changes should go through direct execution to make the train
B) No — keep plan mode for the assertion-helper fix, and recover the lost minutes by having a human pre-approve its plan mode proposal without reading it, since the reviewer is the slow part of the step
C) Yes — provided the assertion-helper change is confined to the most conservative of the three refactor approaches, picked without weighing trade-offs, since the conservative option stays safe under time pressure
D) No — a 60-file change with three materially different valid approaches is the ambiguity plan mode exists for; if the window genuinely can't absorb it, defer that fix to the next window

## Q10
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.5 Agent SDK Hooks
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, and account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human. The company operates under a compliance mandate that every refund and account change be auditable after the fact, while the support team is separately measured on first-contact resolution speed.

An engineer writes a single PreToolUse hook meant to cover two needs at once: for process_refund, it inspects the requested amount and blocks the call whenever it exceeds $500 without an escalation flag set — and audit logs confirm no over-limit refund has run since; for lookup_order, the same hook is meant to rewrite the tool's returned date field into ISO-8601 before Claude sees it, on the reasoning that keeping both checks in one place is simpler to maintain. Two weeks later, refunds over $500 are still reliably blocked, but customers are still occasionally told incorrect delivery timelines because lookup_order's inconsistent date format is still reaching the model unchanged. What is the mistake?

A) PreToolUse runs before a tool executes, so at that stage no lookup_order result exists yet for the hook to rewrite; the date normalization needs its own PostToolUse hook on that tool
B) The hook's two checks are both sound, but one registration fires at one stage only; register the same script at both the pre- and post-execution stages so it sees arguments and results
C) A shared PreToolUse hook cannot branch its behavior on the tool name it was invoked for, so it has to be split into one hook per tool regardless of lifecycle stage
D) The lifecycle stages are mismatched in the other direction; move the $500 refund block into PostToolUse as well, so both checks run at one stage and stay maintainable in a single place

## Q11
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.3 Structured Output with Tool Use
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

The CI review bot's post_finding tool has tool_choice set to "any" (so some tool call is always guaranteed) and a JSON schema requiring severity, file, line, and a rootCauseCategory field that is also required and must be one specific enum value. On cross-cutting findings that span multiple files and don't cleanly fit one bucket, Claude has started fabricating a plausible-sounding but inaccurate rootCauseCategory rather than ever leaving it blank, because the schema forces every declared field once post_finding is called. What schema change fixes the fabrication without sacrificing the guarantee that every finding still comes back as a valid post_finding call?

A) Return tool_choice from "any" to "auto" and leave the schema untouched, since forcing a call is what pressures the model into populating a field it has no confident value for
B) Drop rootCauseCategory from the required fields and redefine it as optional free text, so downstream triage reads it as unstructured context on the findings where the model does supply something
C) Leave the schema as it stands and add a validation-and-retry step that re-prompts Claude to select a genuine root cause whenever a submitted finding's category reads as suspiciously generic
D) Make rootCauseCategory nullable, or add an explicit "cross-cutting"/"unclear" enum member, so a finding that fits no single bucket can be represented accurately rather than invented

## Q12
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.4 Integrating MCP Servers
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

A senior engineer sets up an MCP server giving Claude direct write access to the production Kubernetes cluster via kubectl, configured in the shared, git-committed .mcp.json so the whole team gets consistent access, with the cluster's admin token referenced through ${K8S_ADMIN_TOKEN} environment-variable expansion rather than hard-coded. The kubectl-applying tool itself has no gate of any kind; it can directly apply changes to the cluster. Given that this setup correctly avoids hard-coding the secret and correctly uses shared project scope, is it acceptable as-is under the production-infra review/reversibility policy?

A) Yes — ${K8S_ADMIN_TOKEN} expansion inside a shared, committed .mcp.json satisfies both the secret-handling and the team-consistency requirements, which is what the policy asks of a production MCP server
B) No — secret handling and shared scoping are configuration hygiene, not review or reversibility; the kubectl-applying tool still needs its own deterministic gate, such as a PreToolUse hook or dry-run step
C) No — move the admin token into each engineer's personal ~/.claude.json despite the inconsistent access that reintroduces, since production credentials should never be referenced from a committed shared file
D) Yes — once a few-shot example is added to the system prompt showing Claude pausing for an engineer's confirmation before it applies any cluster-mutating kubectl command to production

## Q13
Domain: 5. Context Management & Reliability
Subtopic: 5.6 Information Provenance & Multi-Source Synthesis
Scenario: Multi-Agent Research System

A multi-agent research system built on the Claude Agent SDK uses a coordinator agent that delegates to specialized subagents — one searches the web, one analyzes documents, one synthesizes findings, and one generates reports — to produce comprehensive, cited reports for clients on tight publication deadlines. Every claim in a final report must be traceable to a specific source, and the research team is also expected to reuse prior sessions' work rather than re-researching from scratch.

Two market-research reports, published the same month and both credible, give different figures for the SMB adoption rate of a client's product: Report A says 34% (surveyed 500 companies with 10-50 employees), Report B says 61% (surveyed 500 companies with 1-200 employees, skewing toward very small teams). Facing the report deadline, the synthesis subagent picks 61% as the headline number because it's the more impressive figure for the client's executive summary, discarding 34% as "the more conservative outlier." Since both sources are credible and published at essentially the same time — so recency can't break the tie — what should synthesis actually do?

A) Lead with 61% as the headline figure because it is the stronger number for the client's executive summary, and cite Report A's 34% in a footnote for completeness
B) Average the two into a single reconciled headline figure of roughly 47.5%, since both surveys are credible, similarly sized, and published within the same month
C) Keep both figures with their own attribution and their differing sampled populations (10-50 vs. 1-200 employees), noting that the methodology gap likely explains the difference
D) Drop both figures and state in the report that the SMB adoption rate could not be reliably established from the sources available before the publication deadline

## Q14
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.2 Multi-Agent Orchestration
Scenario: Multi-Agent Research System

A multi-agent research system built on the Claude Agent SDK uses a coordinator agent that delegates to specialized subagents — one searches the web, one analyzes documents, one synthesizes findings, and one generates reports — to produce comprehensive, cited reports for clients on tight publication deadlines. Every claim in a final report must be traceable to a specific source, and the research team is also expected to reuse prior sessions' work rather than re-researching from scratch.

With a one-hour publication deadline, someone proposes letting the web-search subagent hand its raw source list directly to the report-generation subagent, bypassing the coordinator, since "it's just data, no reasoning needed" and the round-trip through the coordinator costs time. After the change, two report sections cite sources the document-analysis subagent had separately flagged as unreliable or outdated, because the report subagent received the raw web-search list without the document-analysis subagent's reliability assessment ever being merged in — and the coordinator's logs show no record of what the report subagent actually received. What is the correct fix?

A) Route every inter-subagent handoff back through the coordinator, which merges the web-search source list with the document-analysis reliability assessment before delegating the vetted findings onward to the report subagent
B) Give the report subagent read access to both other subagents' raw outputs directly, keeping the coordinator out of the critical path, but require it to log the sources it cited
C) Keep the direct handoff for its speed and add a citation-checking subagent at the end of the chain that strips any citation later found unreliable or outdated from the draft
D) Have the report subagent call the document-analysis subagent itself to re-check each source's reliability immediately before citing it, so the reliability assessment arrives without any coordinator round-trip at all

## Q15
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.4 Validation & Retry Loops
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

CI-generated test stubs pass schema validation as structurally valid test code, but roughly 8% of the time a stub asserts a wrong expected value — caught only by actually running the generated test against the real function and observing a runtime assertion failure, not by schema validation. Currently, on any such runtime failure the pipeline restarts the entire test-generation step from scratch, up to three times, with the identical original prompt each time, burning a meaningful chunk of the fixed pre-merge time budget on that 8%, and about a third of those exhausted-retry cases still fail and block the merge anyway. What should replace this loop?

A) Raise the retry limit from three to six and keep the original prompt, so more of the failing 8% clears before the fixed pre-merge budget is spent and fewer cases block the merge
B) Retry with the function, the failed stub, and the observed expected-versus-actual mismatch as feedback, keeping a ceiling near two attempts and routing anything still failing to human review
C) Move test-stub generation into plan mode, so Claude proposes its intended assertion values for human approval before any test code is generated and executed in the pipeline
D) Execute every generated assertion once locally before the retry loop is reached at all, since running it first sharpens the feedback quality without needing changes to the retry logic

## Q16
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.3 Path-Specific Rules
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

The team wants a new policy: any *.sql file under **/migrations/ must ship with a corresponding down-migration in the same PR, applied consistently across 40+ package directories. An existing .claude/rules/sql-style.md file already carries paths: ["**/*.sql"] for unrelated SQL formatting conventions, and an engineer proposes adding the down-migration requirement into that same file, reasoning "it's already scoped to *.sql, may as well add it there." Given that the down-migration requirement and the formatting conventions are unrelated policies with different intended scopes — one specific to migrations, one applying to every SQL file including ad hoc analysis queries — is adding it to the existing file the right move?

A) Yes — both policies govern *.sql files, so folding them into one rules file avoids maintaining a second file and keeps the SQL conventions discoverable in a single place across 40+ packages
B) Yes — and while editing it, broaden the paths glob to include **/*.py, so the Python migration-runner scripts that execute those SQL files fall under the same down-migration requirement
C) No — path-specific rules should be scoped to the policy they govern rather than a shared extension; a new rule scoped to **/migrations/*.sql keeps this from firing on ad hoc analysis queries
D) No — a mandatory paired down-migration is a "must never ship without" guarantee that path-specific rules cannot enforce; a PreToolUse hook has to block any migration commit missing its pair

## Q17
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.3 Tool Distribution & Tool Choice
Scenario: Multi-Agent Research System

A multi-agent research system built on the Claude Agent SDK uses a coordinator agent that delegates to specialized subagents — one searches the web, one analyzes documents, one synthesizes findings, and one generates reports — to produce comprehensive, cited reports for clients on tight publication deadlines. Every claim in a final report must be traceable to a specific source, and the research team is also expected to reuse prior sessions' work rather than re-researching from scratch.

Policy requires that no claim from a web source ever enter a report until a verify_source_credibility tool has run against that source at least once — though sources already verified in an earlier cached research pass don't need re-verification. Someone proposes always setting tool_choice to a forced {type: "tool", name: "verify_source_credibility"} for the web-search subagent's very first turn in every session, including ones resuming from a prior session whose sources are already verified and cached. What is the drawback of forcing that tool unconditionally on every first turn, and what is the better approach?

A) There is no meaningful drawback — one extra call is cheap overhead, and forcing the same named tool on every first turn guarantees the policy uniformly, resumed and cached sessions included
B) The drawback is rigidity — set tool_choice to "any" instead, so the subagent is still required to call something but can choose verify_source_credibility or another tool as the turn warrants
C) The drawback is scope — a forced tool_choice binds only a single turn, so replace it with a system-prompt instruction to always verify sources before citing, which governs the entire session
D) The drawback is wasted work re-verifying sources a resumed session already has cached; force the tool only on turns carrying no cached verification, and otherwise leave tool_choice at "auto"

## Q18
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.7 Session State, Resumption & Forking
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers, under an internal policy that any change touching production infrastructure must be reviewable and reversible.

An engineer uses --resume to reopen a session mid-refactor of a shared utils module, needing to finish before a release window closes. Over the weekend, a teammate merged an unrelated PR that changed two function signatures inside that same utils module — signatures the in-progress refactor depends on. The engineer wants to keep the refactor's already-agreed plan and partial edits without losing time, while still producing a reviewable, coherent change history per policy, and someone suggests fork_session so they can "branch off cleanly" before continuing. Is fork_session the right call here, and if not, what should they do instead?

A) No — a fork branches from the resumed conversation's current state, which still holds the pre-merge signatures; start a fresh session seeded with the refactor's plan, progress, and the two changed signatures
B) Yes — fork_session branches from a clean, up-to-date read of utils/, so work continues against the merged signatures while the refactor's already-agreed plan and partial edits carry over intact
C) No — keep working in the resumed session as-is, since the model will register the signature mismatch on its own the next time it reads one of the affected functions in that utils module
D) Yes — but run /compact on the resumed session before forking, so the stale signature information is summarized away and the fork inherits a condensed, cleaner version of that state

## Q19
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.6 Integrating Claude Code into CI/CD
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

A CI step must run Claude Code non-interactively and produce machine-parseable findings gated by a JSON schema, so downstream tooling can auto-post only "blocking"-severity comments, all within a fixed 3-minute step budget. An engineer's config already uses claude -p for the non-interactive piece, which works, but separately pipes Claude's freeform text output through a custom regex-based parser to extract severity — a parser that occasionally misparses and either double-posts or silently drops a blocking finding. What is the correct combination of flags/mechanisms to reliably get machine-parseable, schema-conformant findings within the step, while keeping the run non-interactive?

A) Keep -p and add --output-format stream-json, so the CI parser consumes findings incrementally as they arrive and is far less likely to run out the fixed three-minute step budget
B) Keep -p for the review call and chain a second Claude call behind it that re-reads the freeform output and reformats it into the JSON structure the downstream comment-posting tooling expects
C) Combine -p with --output-format json and a --json-schema defining the findings structure, severity enum included, so the response itself comes back schema-conformant with no separate parser
D) Keep -p and the regex parser, and add several few-shot examples to the review prompt showing the exact freeform-text layout the regex expects, so the occasional misparse becomes rare

## Q20
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.5 Batch Processing Strategies
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and provide feedback on pull requests, under a mandate to keep comments actionable, minimize false positives, and never add latency that blocks a release train with a fixed deploy window.

A weekly audit job scans 1,000 merged PRs for lingering TODO-marked security concerns — latency-tolerant, non-blocking work already running on the Message Batches API for the cost savings. The team now wants to extend it: for any PR whose TODO references an external ticket ID, Claude should also call a get_ticket_status MCP tool and, depending on the result, potentially issue a follow-up call before deciding the final flag — a chain whose next step depends on the previous step's outcome. Someone proposes just adding this as more instructions within the same batched request per PR. Given that the Batch API does not support this kind of multi-turn, result-dependent tool calling, what should the team do?

A) Add the ticket-status check as a further instruction in the same batched request per PR, since a batch request can carry any instruction a synchronous call can and simply resolves asynchronously
B) Move the entire weekly audit, original TODO scan included, onto the synchronous API, since one result-dependent tool chain means the workload as a whole is no longer appropriate for batching
C) Stay on the Batch API and pre-fetch every referenced ticket's status ahead of the run, inlining it as static context for all 1,000 PRs, so no in-batch tool call is needed anywhere in the job
D) Split the audit — keep the bulk TODO scan on the Batch API for its cost and latency tolerance, and route only the ticket-referencing subset through the synchronous API for the follow-up
