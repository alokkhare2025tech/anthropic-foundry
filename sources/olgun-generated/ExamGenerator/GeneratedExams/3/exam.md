# Exam 3

Title: CCAR-F Practice Exam 3 — Hardest Edition (Weighted Domain Spread)
Total: 40

## Q1
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.1 Designing Agentic Loops
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

During a billing dispute, the agent calls process_refund and, in the same response, also writes an explanatory sentence to the customer before the tool result has even been appended to the conversation. The harness driving the loop currently ends the turn whenever response.content[0].type is "text", so it returns that sentence to the customer and never appends the process_refund tool result or executes the escalate_to_human call the model queued right after it. What should the harness check instead to decide when the loop is actually done?

A) The response's stop_reason field, continuing the loop and executing any tool_use blocks whenever stop_reason is "tool_use" — regardless of whether a text block appears earlier in the same response
B) Whether the tool_use block appears before or after the text block in content, ending the loop only when tool_use comes last
C) tool_choice set to "any" for every turn, so the model can never return a text-only response and the harness always has a tool call to execute
D) A lower iteration cap so the harness force-stops after fewer turns, before the queued escalate_to_human call can run

## Q2
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.1 Designing Tool Interfaces
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

Agents increasingly misroute billing-dispute lookups: they call lookup_order when they need get_customer's verification data, and call get_customer when the actual need is order-level detail, because both tools' descriptions are one line long — "get_customer: gets customer info" and "lookup_order: gets order info" — with no guidance on when to use one over the other. Three engineers each propose a different fix. Which is the correct first step?

A) Add a few-shot example to the system prompt showing the model choosing correctly between the two tools in a sample dispute
B) Build a lightweight routing classifier that inspects the customer's message and decides which of the two tools to call before the agent runs
C) Consolidate get_customer and lookup_order into a single get_account_info tool that returns both customer and order data in one call
D) Rewrite both tools' descriptions with their purpose, input formats, example queries, and an explicit "use this NOT that" boundary distinguishing the two

## Q3
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.1 CLAUDE.md Hierarchy & Scoping
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

A directory-level services/payments/CLAUDE.md instructs "never log request bodies, they may contain card numbers," while the root CLAUDE.md instructs "log full request and response bodies for every handler to aid debugging." The team assumed the more specific, deeper file would simply take precedence, but Claude Code sessions working in services/payments/ still sometimes log request bodies. What is the actual cause and correct fix?

A) Directory-level CLAUDE.md files require a --scope flag to activate; add it to the project's launch configuration
B) The directory file is being ignored because it must be named payments/CLAUDE.md.local to take precedence over root
C) CLAUDE.md files are concatenated, not overridden, so both conflicting instructions load together — rewrite one so the instructions no longer contradict, then verify with /memory
D) Move the root instruction into a .claude/rules/ file with a paths glob so it no longer applies inside services/payments/

## Q4
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.1 Prompts with Explicit Criteria
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

Reviewers have started ignoring the CI bot's comments entirely after its "security" category flagged 45% false positives last sprint — even its correctness and test-coverage findings, which are accurate, now get dismissed unread. The team's first instinct is to raise the self-reported confidence threshold required before a security finding is posted. What should they do instead?

A) Raise the self-reported confidence threshold for the security category so only its highest-confidence findings post
B) Add a routing classifier that filters security findings before they reach the PR comment step
C) Temporarily disable the security category entirely while rewriting its criteria with explicit report/skip conditions and examples, then re-enable it once its false-positive rate drops
D) Switch the security category's review step to plan mode so Claude proposes findings before committing to them

## Q5
Domain: 5. Context Management & Reliability
Subtopic: 5.1 Managing Conversation Context
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

Partway through a lengthy billing dispute, the conversation history is auto-summarized to save tokens, and "the customer was charged $1,284.60 on invoice INV-55210, dated April 2nd" becomes "the customer disputes a recent invoice charge" in the summary — while the same turn's lookup_order result, which returned 38 fields, is kept in full in history. The agent later can't quote the exact charge back to the customer. What should the team change?

A) Disable summarization entirely so the full conversation history is always retained verbatim
B) Increase the token budget so summarization triggers less often during long disputes
C) Extract transactional facts like the amount, invoice ID, and date into a persistent case-facts block that is never summarized, and trim the 38-field tool result to the fields actually relevant to the dispute
D) Ask the summarization step to "preserve all important numbers" as an explicit instruction each time it runs

## Q6
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.1 Designing Agentic Loops
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

While refactoring a legacy module across 14 files, the agent's harness force-stops the session at a fixed cap of 8 tool-calling turns, on the theory that 8 is enough for "typical" refactors. On this particular module the refactor genuinely needs 11 turns, so the session is cut off mid-edit with three files left untouched, while on a simpler 3-file refactor last week the same cap left it idling through unnecessary turns before finishing early. What is the correct role for that turn cap?

A) Remove the cap entirely so every refactor runs until the agent decides it's finished
B) Keep a generous cap only as a safety fallback against runaway loops, and let the primary stop condition be stop_reason reaching "end_turn"
C) Lower the cap further so oversized refactors fail fast and get split into smaller manual tasks instead
D) Replace the fixed 8-turn cap with a fixed 8-file cap, since files (not turns) are the actual unit of work

## Q7
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.1 Designing Tool Interfaces
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

The productivity agent's analyze_code tool can, depending on hidden parameters, lint a file, compute cyclomatic complexity, or summarize a module's public API — its one-line description just says "analyzes code." Engineers report the agent frequently calls it expecting a lint result and gets back a complexity score instead, or vice versa. What is the most effective fix?

A) Split analyze_code into purpose-specific tools — lint_file, compute_complexity, summarize_api — each with a crisp, single-purpose input/output contract
B) Add 2-4 few-shot examples to the system prompt showing which hidden parameter combination produces which result
C) Leave analyze_code as one tool but write a longer description enumerating all of its hidden modes and parameter combinations in prose
D) Introduce a routing step that classifies the engineer's request and picks the right hidden parameters for analyze_code automatically

## Q8
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.2 Custom Slash Commands & Skills
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

The CI pipeline invokes a review-codebase-context skill before generating PR feedback; the skill greps and reads dozens of files to build context, and all of that exploratory output lands directly in the main session, leaving less room for the actual review generation and occasionally causing the final comment to reference stale intermediate findings instead of the current diff. Which skill frontmatter option addresses this?

A) argument-hint, so the skill prompts for the specific files to review instead of exploring broadly
B) allowed-tools restricted to Read and Grep only, so the skill can't write any files during exploration
C) Move the skill from .claude/commands/ into .claude/skills/ so it is versioned alongside the CLAUDE.md hierarchy
D) context: fork, so the skill's exploration runs in an isolated subagent and only its summary returns to the main session

## Q9
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.1 Prompts with Explicit Criteria
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

The extraction system's "anomaly_flag" field — meant to mark line items that look erroneous — has a 38% false-positive rate on scanned invoices, and downstream reviewers have started ignoring anomaly_flag results across the board, including on the vendor and total fields that are accurate. The team's first proposal is to require a higher self-reported confidence before setting anomaly_flag. What should they do instead?

A) Keep the confidence-based trigger but average it across the last 10 documents before deciding whether to set anomaly_flag
B) Raise the self-reported confidence threshold required before anomaly_flag is set to true
C) Add a nullable "unclear" value to the anomaly_flag schema so the model can abstain instead of guessing
D) Temporarily disable anomaly_flag while rewriting its criteria with explicit, concrete examples of what counts as an anomaly, then re-enable it once its false-positive rate improves

## Q10
Domain: 5. Context Management & Reliability
Subtopic: 5.2 Escalation & Ambiguity Resolution
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

When a vendor disputes an extracted total through the system's chat-based resolution assistant, the assistant currently escalates to a human accountant whenever the vendor's message sounds frustrated, or whenever its own confidence in defending the extracted total drops below 70%. Last week it escalated a vendor who was simply annoyed about response time but had a trivial one-field correction, while it kept trying to resolve a case where the invoice's tax jurisdiction was genuinely undocumented in company policy. What should the two current triggers be replaced with?

A) A single trigger: escalate whenever the vendor repeats the same complaint twice in the conversation
B) Escalate strictly on sentiment, since a vendor sounding frustrated is the clearest signal that human judgment is needed
C) Escalate strictly on self-reported confidence, but recalibrate the threshold using a labeled validation set instead of a fixed 70%
D) Escalate on an explicit request for a human, a genuine policy gap the extraction criteria don't cover (like the undocumented tax jurisdiction), or an inability to make progress after a real attempt — not sentiment or self-reported confidence

## Q11
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.2 Multi-Agent Orchestration
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

The support resolution system now routes multi-issue tickets to a coordinator that delegates to a billing-specialist subagent and a shipping-specialist subagent, then synthesizes their findings into one reply. On tickets that mention both a wrong charge and a delayed shipment, the final reply increasingly addresses only the charge and never mentions the shipment at all, even though the shipping subagent completed its investigation successfully. What is the most likely cause and fix?

A) The shipping subagent is broken and should be given the same tools as the billing subagent
B) The two subagents are communicating directly and dropping the shipping findings before the coordinator sees them
C) The coordinator's task decomposition is too narrow — it isn't accounting for both concerns when it plans the synthesis step — and should be fixed to cover every issue the ticket raises
D) The system needs a third "synthesis" subagent dedicated solely to merging the billing and shipping reports

## Q12
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.2 Structured Error Responses
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

When process_refund fails, it currently returns only {"isError": true, "message": "Operation failed"}. Last week this happened for three different reasons — a timed-out payment gateway, a refund amount exceeding the order total, and an already-refunded order — and the agent handled all three identically: it retried each one three times before giving up and telling the customer to try again later, even the order that could never succeed on retry. What should process_refund's error response include instead?

A) A single boolean, refund_possible, so the agent can decide in one check whether to retry
B) A category (transient, validation, business, permission), an isRetryable flag, a technical message, and a user-facing message, so the agent retries only what's actually retryable
C) The HTTP status code returned by the payment gateway, so the agent can map it to a retry decision itself
D) A fixed retry count of exactly one, applied uniformly across all process_refund failures

## Q13
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.3 Path-Specific Rules
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

The team wants every *.test.tsx file across the monorepo's 40+ package directories to follow the same testing conventions — no snapshot tests, always mock the API layer — regardless of which package it lives in. An engineer starts by adding the convention to the root CLAUDE.md, but that also surfaces the testing convention when Claude is editing unrelated production files, and adding it to each package's directory-level CLAUDE.md means keeping 40+ copies in sync. What is the correct mechanism?

A) A .claude/rules/ file with a paths field matching **/*.test.tsx, so the convention loads only when Claude is working with a matching test file, regardless of directory
B) A single directory-level CLAUDE.md placed at the monorepo root's tests/ folder, since that's where most test files are discovered
C) A skill invoked manually before writing any test file, so the convention only applies when explicitly requested
D) An @import of a shared testing.md file into every one of the 40+ package-level CLAUDE.md files

## Q14
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.2 Few-Shot Prompting
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

The CI review bot's severity labels (blocking / suggestion / nit) are inconsistent — the same class of null-pointer risk gets labeled "blocking" on one PR and "nit" on another — despite the prompt already containing three paragraphs describing what separates each severity level in the abstract. What is the most effective next step?

A) Replace the abstract severity descriptions with 2-4 worked examples, each showing a concrete code pattern, its assigned severity, and the reasoning for that severity
B) Add a fourth paragraph to the prompt clarifying the difference between "blocking" and "suggestion" in more precise language
C) Switch the severity-labeling step to use a lower temperature so the model's output becomes more deterministic
D) Add a self-reported confidence score to each finding and only post findings above a fixed confidence threshold

## Q15
Domain: 5. Context Management & Reliability
Subtopic: 5.3 Error Propagation in Multi-Agent Systems
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

The billing-specialist subagent hits a timeout when it calls the payment gateway mid-investigation. Instead of retrying locally or reporting the timeout, it catches the exception and returns {"findings": [], "status": "complete"} to the coordinator, which then tells the customer their charge is correct with no discrepancy found — when in fact the gateway was never successfully queried at all. What is wrong with the subagent's behavior and what should it do instead?

A) It silently suppressed the failure as a false success; it should retry the transient timeout locally first, and if it still can't recover, propagate a structured error with the failure type, what was attempted, and any partial results
B) It should have immediately aborted the entire ticket-resolution workflow rather than returning any result to the coordinator
C) It should have escalated to a human based on its own low confidence in the payment gateway response
D) It should have propagated the timeout to the coordinator immediately without any local retry, since transient failures like gateway timeouts are always the coordinator's responsibility to resolve

## Q16
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.2 Multi-Agent Orchestration
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

A coordinator agent for the developer-productivity tool always spawns both a test-writer subagent and a documentation-writer subagent for every incoming request, even when an engineer asks only "write me the missing unit tests for calculatePricing" with no mention of documentation. This doubles the wall-clock time and token cost of nearly every simple request. What should change?

A) Merge the test-writer and documentation-writer subagents into a single subagent that always produces both outputs in one pass
B) Reduce the coordinator's iteration cap so it can't afford to spawn both subagents on simple requests
C) Give the documentation-writer subagent a broader tool set so it finishes faster and the wait matters less
D) Have the coordinator dynamically select which subagent(s) to delegate to based on what the request actually asks for, instead of always spawning both

## Q17
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.3 Tool Distribution & Tool Choice
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

The developer-productivity agent has accumulated 18 tools over several sprints — six for git operations, five for package-management queries, four MCP-exposed CI status checks, and three code-search helpers — all available to the same single agent handling every engineer request. Tool-selection reliability has visibly degraded: the agent increasingly picks a plausible-sounding but wrong tool for straightforward requests it handled correctly with fewer tools. What is the most effective fix?

A) Add few-shot examples covering all 18 tools so the agent has a reference case for each one
B) Set tool_choice to "any" so the agent is forced to commit to some tool instead of hesitating between similar ones
C) Scope the toolset — split responsibilities across role-specific agents (or subagents) so each one selects from a focused ~4-5 tools relevant to its role
D) Rename all 18 tools with more descriptive names while keeping them on the single agent

## Q18
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.4 Plan Mode vs Direct Execution
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

The CI pipeline occasionally invokes Claude Code non-interactively to fix a flaky test it just flagged. For one PR, the flakiness is a single assertion using a non-deterministic timestamp comparison in one test file — an obvious, well-scoped fix. For another PR, the flakiness turns out to originate from a shared test-fixture module used by 30 other test files, and fixing it safely could mean changing the fixture's contract in one of several different ways. Should both be handled the same way?

A) Yes — always use plan mode for CI-triggered fixes, since CI runs unattended and no human is present to review a wrong direct edit
B) No — the single-file timestamp fix is well-scoped for direct execution, while the shared-fixture case has multiple valid approaches and multi-file consistency implications and calls for plan mode first
C) No — the shared-fixture case is objectively harder to fix, so it warrants direct execution by the most senior approach available, while the trivial timestamp fix should go through plan mode to be safe
D) Yes — always use plan mode for both, since any CI-triggered change to test infrastructure should be planned regardless of scope

## Q19
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.3 Structured Output with Tool Use
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

The extraction pipeline defines an extract_invoice tool with a JSON schema and leaves tool_choice on "auto", on the reasoning that the model will naturally call the tool since that's clearly the right action. On a small fraction of documents — mostly ones with unusual formatting — the model instead returns a plain-text explanation of why it's unsure, which breaks the downstream parser expecting a tool call every time. What change guarantees a tool call happens on every document?

A) Add a few-shot example showing the model calling extract_invoice even on unusually formatted documents
B) Set tool_choice to "any" (or force the specific extract_invoice tool), so the model must call a tool rather than optionally returning text
C) Add strict:true to the schema alone, leaving tool_choice on "auto"
D) Lower the model's temperature so it more reliably chooses to call the tool on ambiguous documents

## Q20
Domain: 5. Context Management & Reliability
Subtopic: 5.4 Context in Large Codebase Exploration
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

An engineer is using Claude to explore a folder of 300 historical invoice templates from different vendors, trying to catalog the field-naming conventions and layout quirks each vendor uses before designing the extraction schema. Early in the session, its notes are specific — "Acme Corp uses UNIT_PRICE while Globex uses unit_cost, both right-aligned in column 4" — but after two hours of continuous exploration, its answers drift into generic statements like "most vendors use a standard columnar layout" even when asked about a specific vendor it examined an hour ago. The team assumes the context window is simply too small. What is the actual cause and correct fix?

A) The context window genuinely is too small for 300 templates; switch to a model with a larger context window
B) It's context degradation from attention quality declining as verbose exploration output accumulates, not a token-limit problem — have the agent write its per-vendor findings to a scratchpad file on disk as it goes, rather than relying on everything staying sharp in the live conversation
C) Compact the conversation only once the context window is completely full, to preserve as much detail as possible before compacting
D) Delegate the entire 300-template exploration to a single subagent so it happens outside the main conversation, purely to parallelize the work faster

## Q21
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.3 Subagent Invocation & Context Passing
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

A team adds a shipping-specialist subagent to the coordinator's AgentDefinition registry, expecting multi-issue tickets to now get routed to it, but the coordinator continues silently handling every shipping question itself using its own general knowledge, without ever invoking the new subagent — and no error appears anywhere in the logs. What is the most likely cause?

A) The coordinator's own allowed-tools list doesn't include the Agent (or Task) tool, so it's structurally unable to spawn any subagent and silently falls back to doing the work itself
B) The shipping-specialist subagent's own allowed-tools list is missing the Agent (or Task) tool, preventing it from being spawned
C) The coordinator is spawning the shipping-specialist subagent correctly, but the subagent's context isolation is preventing its response from returning
D) The AgentDefinition for the shipping-specialist is missing a model field, causing invocation to silently no-op

## Q22
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.3 Tool Distribution & Tool Choice
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

Company policy requires that every ticket begin with a get_customer verification call before anything else happens, no exceptions. The team currently relies on a system-prompt instruction stating this requirement, but audit logs show the agent skips straight to lookup_order first on roughly 6% of tickets. Someone proposes fixing this by setting tool_choice to a forced {type: "tool", name: "get_customer"} for the agent's very first turn only. Is this the right fix, and why?

A) No — tool_choice only controls whether a tool is called at all, never which specific tool, so it cannot enforce get_customer specifically
B) No — tool_choice is a client-side setting that has no effect on which tool the model actually calls
C) Yes, but only because the system-prompt instruction was also necessary — tool_choice alone cannot guarantee this, only prompt wording can
D) Yes — forcing the named tool for that turn deterministically guarantees get_customer runs first, replacing a prompt-only instruction the model was skipping 6% of the time

## Q23
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.4 Plan Mode vs Direct Execution
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

An engineer asks the productivity agent to upgrade a deprecated logging library across 45 files, where the exact call-site changes vary (some need a new import, some need a parameter renamed, a few need the whole logging pattern restructured), and separately asks it to fix an off-by-one in a single pagination function everyone agrees on. The team is debating whether to run both requests through plan mode first. What is the correct approach?

A) Use plan mode for the pagination fix, since any change to code that affects user-facing behavior deserves upfront review, and direct execution for the migration since it's mechanical repetition
B) Use direct execution for both, since the migration's per-file changes are all conceptually "the same kind of edit" even though they vary in specifics
C) Use plan mode to agree the migration's approach for the varying call-site patterns, then execute file-by-file against that agreed plan; use direct execution for the well-scoped, single-approach pagination fix
D) Use plan mode for both, since any multi-step task — however small — benefits from an upfront explore-and-propose phase

## Q24
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.4 Validation & Retry Loops
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

The CI pipeline's auto-generated test stubs sometimes assert an expected value that doesn't match what the function under test would actually return for the given input — a semantic error the JSON schema validation doesn't catch, because the assertion is syntactically valid either way. When this happens, the team's current fix is to re-run the exact same generation prompt and hope for a different, correct assertion. What should replace this naive retry?

A) Add a stricter JSON schema so the test-stub tool call is rejected unless the assertion field matches a fixed regex pattern
B) Lower the temperature on the generation call so the same prompt more reliably produces the correct assertion on the first try
C) Retry with the original function, the previously generated (incorrect) stub, and the specific mismatch identified, so the model can self-correct against concrete feedback instead of guessing again from scratch
D) Switch the test-stub generation step to the Message Batches API so more attempts can be made overnight without blocking the pipeline

## Q25
Domain: 5. Context Management & Reliability
Subtopic: 5.5 Human Review & Confidence Calibration
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

The support team wants to reduce human review of the agent's refund recommendations, citing that the recommendation engine is "97% accurate overall" across the last quarter. Before removing review entirely, an analyst breaks the number down and finds it's 99% accurate for refunds under $50 but only 71% accurate for refunds tied to shipping-damage claims specifically, a segment that happens to be a small share of total volume. What should the team do?

A) Proceed with removing human review entirely, since 97% overall comfortably clears any reasonable bar for automation
B) Remove human review only for the shipping-damage segment, since its lower accuracy means it needs the least additional scrutiny to catch up
C) Keep human review in place for the shipping-damage segment (and any other segment that validates poorly), while considering reduced review only for segments like sub-$50 refunds that validate well individually
D) Recompute the overall accuracy using a larger sample to see if it still holds at 97%, and use that recomputed number as the basis for the review decision

## Q26
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.4 Workflow Enforcement & Handoff
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

The productivity agent is allowed to run arbitrary Bash commands to automate repetitive tasks, and the team wants to guarantee it never runs a destructive git command (git push --force, git reset --hard) against the shared main branch without explicit human sign-off. The current safeguard is a CLAUDE.md line stating "never force-push or hard-reset main without asking first," but the agent has bypassed it twice this month during long automated sessions. What is the correct fix?

A) Move the instruction from CLAUDE.md into a .claude/rules/ file scoped to *.sh files, so it loads more consistently
B) Add a PreToolUse hook that intercepts Bash calls matching those destructive git patterns against main and blocks or redirects them to a human-confirmation step before execution
C) Add several few-shot examples to CLAUDE.md showing the agent correctly asking before a force-push
D) Rewrite the instruction in stronger language — "NEVER under any circumstances" — and move it to the top of CLAUDE.md

## Q27
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.4 Integrating MCP Servers
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

One engineer configures a GitHub MCP server in their own ~/.claude.json with a hard-coded personal access token, and it works well for them individually. When the rest of the team pulls the repository, none of them have the GitHub MCP server available at all, and the engineer has to walk each teammate through setting it up manually. What is the correct fix?

A) Move the server definition into the project's .mcp.json, committed to version control, with the token referenced via ${GITHUB_TOKEN} environment-variable expansion instead of hard-coded
B) Keep the server in each engineer's personal ~/.claude.json, but standardize the exact JSON so everyone's copy is identical
C) Write a custom onboarding skill that each new teammate runs once to hard-code their own personal access token into their ~/.claude.json
D) Leave the configuration as-is, since GitHub integration is a personal productivity preference and shouldn't be forced on the whole team

## Q28
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.5 Iterative Refinement Techniques
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

A PR review from the CI bot surfaces four issues: three are tightly interacting — a renamed exported function, a now-mismatched call site, and a type signature that needs to change together for the code to even compile — and a fourth is a fully independent unused-import warning in an unrelated file. The developer is deciding how to feed this feedback back to Claude Code to apply fixes. What is the right approach?

A) Send all four issues to Claude sequentially, one at a time, verifying each before moving to the next, since sequential feedback is always safer regardless of how the issues relate
B) Send all four issues together in a single message, since batching all feedback into one message is always more efficient regardless of whether the issues interact
C) Send the independent unused-import issue together with the three interacting ones in one message, then have Claude decide internally which to prioritize
D) Send the three interacting issues (renamed function, call site, type signature) together in a single message so Claude reconciles them coherently, and send the independent unused-import fix separately

## Q29
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.4 Validation & Retry Loops
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

The extraction pipeline validates that every invoice's payment_terms field is populated, and when it comes back null, the pipeline automatically retries the extraction up to five times against the same document. For one vendor's invoice template, payment_terms is genuinely never printed anywhere on the document — after five retries it's still null, and the fifth retry's output has started fabricating a plausible-sounding "Net 30" value that appears nowhere in the source. What should the pipeline do differently?

A) Increase the retry limit from five to ten, since the field is important enough to justify more attempts
B) Keep retrying, but lower the model's temperature on each successive attempt so it converges on a consistent value
C) Change the retry prompt to explicitly instruct the model never to fabricate values, while keeping the same five-retry loop
D) Recognize that payment_terms isn't recoverable by retrying because the information was never in the source, and instead return null and route the document to human review rather than retrying further

## Q30
Domain: 5. Context Management & Reliability
Subtopic: 5.6 Information Provenance & Multi-Source Synthesis
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

The extraction system pulls a vendor's "annual revenue" figure from two documents submitted for the same vendor onboarding: a 2024 audited financial statement showing $42M, and a 2026 investor deck showing $58M. The synthesis step currently picks the investor deck's figure as "the" annual revenue because it's the more recently uploaded document, discarding the audited statement's number entirely. What is the correct way to handle this?

A) Average the two figures ($50M) and present that as the vendor's annual revenue, since both sources are credible
B) Keep picking the most recently uploaded document's figure, since recency is generally the right tiebreaker for financial data
C) Discard the investor deck's figure as unreliable and rely solely on the audited financial statement instead
D) Preserve both figures with their attribution and publication dates, and note that the 2024-to-2026 gap may reflect genuine growth (a trend) rather than a contradiction between the two sources

## Q31
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.4 Workflow Enforcement & Handoff
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

A customer's message raises three concerns in one go: a wrong charge on their last invoice, a request to update their shipping address, and a question about whether a promo code still applies to a pending order. The agent currently investigates the wrong charge, resolves it, and replies — never addressing the address change or the promo code question, even though it has tools available to handle both. What is the correct approach for a bundled, multi-concern request like this?

A) Ask the customer to submit each concern as a separate ticket so the agent only ever has to handle one issue at a time
B) Resolve the highest-priority concern (the wrong charge) fully, and explicitly tell the customer to follow up again for the other two
C) Decompose the message into its three distinct concerns, investigate each one, and synthesize a single unified response addressing all three
D) Escalate the entire message to a human agent, since a request bundling three separate concerns exceeds what a single agent turn should attempt

## Q32
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.5 Selecting Built-in Tools
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

An engineer maintaining the support-resolution agent's own codebase needs to find every place a refund threshold constant is referenced before changing its value, including config files, tests, and the escalation-policy module. They start by using Glob with the pattern **/*REFUND_THRESHOLD*, which returns no matches because the constant appears inside files, not in any file names. What should they use instead to find every reference?

A) Glob with a broader wildcard pattern like **/* to list every file, then manually inspect each one
B) Grep for the constant name REFUND_THRESHOLD, which searches file contents rather than file names or paths
C) Read every file in the repository up front to build a complete picture before making the change
D) Write a new file listing every location the constant is used, then Edit that file whenever the constant changes

## Q33
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.6 Task Decomposition Strategies
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

The productivity agent is asked to review a single sprawling PR touching 52 files in one pass, and the review quality is visibly inconsistent — thorough, specific feedback on the first several files reviewed, then increasingly generic comments like "looks fine, consider adding tests" on files reviewed later in the same pass, even on files with real, findable issues. The team's first instinct is to move the review to a model with a larger context window. Is that the right fix?

A) Yes — a larger context window directly increases how much attention the model can devote to each file, so it should resolve the degrading quality
B) No — this is attention dilution from handling too many items in one pass, not a context-size problem; the fix is splitting into per-file local passes plus a separate cross-file integration pass
C) Yes, but only if combined with a stricter iteration cap so the review is forced to move faster through the remaining files
D) No — the fix is to reduce the PR to fewer files by asking the developer to split it before requesting review again

## Q34
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.5 Batch Processing Strategies
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

The platform team runs a weekly audit that asks Claude to review every merged PR from the past week for lingering TODO-marked security concerns, a job that isn't blocking anyone and easily tolerates finishing overnight — they move it to the Message Batches API for the cost savings. In last week's run, 940 of 1,000 requests succeeded but 60 failed due to malformed diffs. Someone proposes resubmitting the entire batch of 1,000 to be safe. What should they do instead?

A) Use each failed request's custom_id to identify exactly the 60 that failed, fix the malformed-diff issue, and resubmit only those 60
B) Resubmit the entire batch of 1,000, since partial batch failures can indicate systemic issues that might also affect requests that appeared to succeed
C) Switch this weekly audit to the synchronous real-time API going forward, since batch clearly can't be trusted to complete a full run reliably
D) Wait 24 hours and resubmit the full batch again, since the Batch API's window may not have been long enough the first time

## Q35
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.5 Agent SDK Hooks
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

A PreToolUse hook is meant to block any Bash command containing rm -rf against a path outside the project's own working directory. The engineer who wrote it has the hook script exit with status 1 whenever it detects such a command, expecting that to block execution — but audit logs show the command still ran anyway. What is the actual problem?

A) PreToolUse hooks cannot block Bash commands at all; only PostToolUse hooks have that capability
B) The hook is checking the command pattern in the wrong lifecycle event; this check belongs in a PostToolUse hook instead
C) Exit codes cannot signal a block under any circumstances; the hook must print a JSON object with "decision": "block" instead
D) Exit 1 does not block — only exit 2 blocks; exit 0 allows the command through, and any other non-zero code (including 1) is treated as a non-blocking error

## Q36
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.6 Integrating Claude Code into CI/CD
Scenario: Claude Code for Continuous Integration

A platform team has wired Claude Code into their CI/CD pipeline to run automated code review, generate test cases, and post feedback on pull requests, with a mandate to keep comments actionable and false positives low.

A CI job invoking Claude Code to review pull requests periodically hangs indefinitely, apparently waiting for some kind of input, and the on-call engineer needs a fix that works reliably across every pipeline run rather than a one-off workaround. Three teammates each suggest a different environment setting or flag they recall seeing in some blog post. Which of the following is the actual documented fix?

A) Set the environment variable CLAUDE_HEADLESS=true before invoking Claude Code in the pipeline
B) Invoke Claude Code with the -p (or --print) flag, which runs it non-interactively: it processes the prompt, prints the result, and exits
C) Add the --batch flag to force Claude Code into a non-interactive processing mode
D) Redirect /dev/null to stdin when invoking Claude Code, so there is never any input for it to wait on

## Q37
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.6 Multi-Instance & Multi-Pass Review
Scenario: Structured Data Extraction

A structured data extraction system built on Claude pulls line items, totals, and other fields out of unstructured documents using tool_use with a JSON schema, validates the result, and forwards it to downstream systems that expect high accuracy.

The extraction pipeline currently has the same Claude session that extracted a document's data also perform the final validation pass, checking its own output for correctness before it's marked ready for downstream use. The team notices this validation pass almost never flags anything, even on documents later found by auditors to contain clear extraction errors. An engineer proposes adding "review your extraction critically and skeptically" to the validation prompt within that same session. Will this fix the problem?

A) Yes — explicitly instructing the model to be critical and skeptical removes the bias, since the instruction directly counteracts the tendency to agree with itself
B) No — the same session still has its own generation reasoning in context, which biases it toward confirming its own extraction regardless of how the validation prompt is worded; an independent instance with no prior context is needed
C) Yes, but only if extended thinking is also enabled for the validation step within that same session
D) No — the fix is to increase the validation step's context window so it can review the extraction more thoroughly

## Q38
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.5 Agent SDK Hooks
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

The support agent's three backend tools return dates in inconsistent formats — get_customer returns Unix timestamps, lookup_order returns ISO-8601 strings, and process_refund returns a locale-formatted date string — and the agent frequently miscompares dates across tools, once telling a customer their order was 47 years overdue for delivery. An engineer proposes adding an instruction to the system prompt telling the model to convert every date it sees to ISO-8601 before reasoning about it. Is this the best fix?

A) No — this is a deterministic normalization problem; a PostToolUse hook should convert every tool's date output to a consistent format before the model ever sees it
B) Yes — a clear system-prompt instruction is sufficient since date-format conversion is a simple, well-defined transformation the model can reliably apply every time
C) No — the fix is a PreToolUse hook that blocks any tool call returning a non-ISO-8601 date
D) Yes, but only if the instruction also includes 2-3 worked examples of correct date conversions

## Q39
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.6 Integrating Claude Code into CI/CD
Scenario: Developer Productivity with Claude

A platform team's developer productivity agent, built on the Claude Agent SDK, helps engineers explore an unfamiliar codebase, understand legacy systems, and automate repetitive tasks using the built-in tools (Read, Write, Edit, Bash, Grep, Glob) alongside several Model Context Protocol servers.

After Claude Code implements a new feature across several files in an interactive session, the engineer asks the same session to "review the diff for bugs before I open the PR." The review comes back clean, but a teammate's manual read five minutes later finds two real issues in the same diff. The engineer wants to fix their workflow before repeating this pattern on the next feature. What should change?

A) Invoke a separate claude -p instance with no prior context to review the diff independently, rather than asking the same session that wrote the code to review it
B) Ask the same session to review the diff a second time, since a single review pass is often insufficient regardless of which session performs it
C) Have the same session enable extended thinking specifically for the review step, since deeper reasoning within the session should surface issues a shallow pass missed
D) Increase the session's context window so it can hold the entire diff plus the full surrounding codebase during the review step

## Q40
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.7 Session State, Resumption & Forking
Scenario: Customer Support Resolution Agent

A retail company's customer support resolution agent, built on the Claude Agent SDK, handles high-ambiguity requests — returns, billing disputes, account issues — through custom MCP tools including get_customer, lookup_order, process_refund, and escalate_to_human, against a target of 80%+ first-contact resolution.

An engineer used --resume to reopen a saved debugging session investigating why the agent mishandled a particular refund case, and finds the agent still reasons from a refund-policy lookup it cached three days ago — the actual policy document has since been updated to lower the auto-approval threshold, but the resumed session has no idea. Someone suggests using fork_session instead, reasoning that forking gives a "cleaner" branch to work from. Would forking solve the problem?

A) Yes — forking creates a version of the session with the stale policy lookup automatically purged before the branch starts
B) Yes — forking always starts from a blank context, so the stale cached lookup would no longer be present
C) No — a fork branches from the current conversation state and inherits the exact same stale cached policy lookup as the original; the fix is a fresh session given a structured summary and told specifically that the policy document changed, so it re-reads just that
D) No — the correct fix is to keep using --resume, but run /compact first so the stale lookup is summarized down to something more manageable
