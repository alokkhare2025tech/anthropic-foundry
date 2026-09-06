# Exam 1

Title: CCAR-F Practice Exam 1 — Weighted Domain Spread
Total: 15

## Q1
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.2 Custom Slash Commands & Skills
Scenario: Claude Code for Continuous Integration

A platform team's CI pipeline runs Claude Code automated reviews on every pull request via `-p`. Separately, new hires occasionally run a long, verbose "explain this legacy subsystem" walkthrough that traces call paths across dozens of files and prints extensive intermediate findings.

The team wants the walkthrough available to any engineer on demand, without its verbose output polluting the main conversation or being loaded into every session's context by default. Where should this procedure live and how should it run?

A) Add the walkthrough steps to the project's `CLAUDE.md` so every session has it ready immediately
B) Package it as a project skill with `context: fork` so it loads on demand and runs isolated
C) Put it in each engineer's `~/.claude/commands/` as a personal slash command
D) Configure it as a `PreToolUse` hook that runs automatically before any `Bash` invocation

## Q2
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.2 Multi-Agent Orchestration
Scenario: Multi-Agent Research System

A multi-agent research system uses a coordinator agent to decompose research questions and delegate to a web-search agent, a document-analysis agent, and a synthesis agent in a hub-and-spoke design, with the coordinator as the sole point of task assignment and information flow.

On a query about "regulatory changes affecting fintech lending in three regions," the final report only covers one region in depth while the other two are barely mentioned. The team wants to fix the underlying cause of the coverage gap rather than patch around it — what should they do first?

A) Add a fourth subagent dedicated to fact-checking the report before it ships
B) Replace hub-and-spoke with direct agent-to-agent communication so subagents can compare notes
C) Instruct the synthesis agent to flag when it thinks a topic is underexplored
D) Review the coordinator's decomposition logs and fix the task breakdown so it explicitly assigns all three regions

## Q3
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.1 Prompts with Explicit Criteria
Scenario: Structured Data Extraction

A structured extraction pipeline pulls line items from vendor invoices — quantities, prices, and flagged anomalies — into structured records that a review team checks before invoices are approved for payment.

One category, "discount anomalies," has a 40% false-positive rate because the prompt instructs the model to "flag anomalies conservatively, only when you're fairly confident." The high FP rate is starting to make reviewers distrust every other category's flags too, and they've begun skimming all flags rather than reading them carefully. What should the team do first?

A) Leave the category active but add a note asking reviewers to double-check discount flags specifically
B) Raise the model's self-reported confidence threshold required to emit a discount-anomaly flag
C) Temporarily disable the discount-anomalies category and rewrite it with explicit, verifiable criteria before re-enabling it
D) Replace "fairly confident" with "extremely confident, only in the most obvious cases"

## Q4
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.1 Designing Tool Interfaces
Scenario: Customer Support Resolution Agent

A customer support resolution agent handles account enquiries by calling internal tools, including `lookup_order` (looks up a single order by order ID) and `get_customer` (returns a customer's profile and history).

The `get_customer` tool was recently expanded to also return the customer's full order history, and since then the agent frequently calls `get_customer` when the customer only asked about one specific order, generating unnecessarily large tool results that get trimmed downstream anyway. What is the most effective fix?

A) Remove the order-history data from `get_customer` and put it behind a bigger, more powerful model that can decide when it's actually needed
B) Add a few-shot example to the system prompt showing the agent calling `lookup_order` for single-order questions
C) Rewrite both tools' descriptions to state their purpose, inputs, and an explicit "use `lookup_order` NOT `get_customer` for a single known order ID" boundary
D) Merge the two tools into a single `customer_data` tool so the model doesn't have to choose

## Q5
Domain: 5. Context Management & Reliability
Subtopic: 5.1 Managing Conversation Context
Scenario: Customer Support Resolution Agent

A customer support resolution agent runs long multi-turn conversations, using progressive summarization to keep older turns from consuming the context window as a case unfolds.

Early in one conversation, the customer stated: "I was charged $89.50 for order #A-3321 on June 2nd, and support already refunded me a $10 credit for the delay." By turn 40, the running summary reads only: "Customer had a billing issue with a past order that was partially resolved." What is the most reliable fix for this pattern?

A) Stop summarizing entirely and always pass the full, unsummarized transcript to every model call
B) Extract the transactional facts (order ID, amount, date, prior resolution) into a persistent case-facts block included in every prompt, kept outside the summarized history
C) Instruct the summarization step to "preserve all important details" more emphatically
D) Increase the model's context window so summarization is no longer necessary

## Q6
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.6 Task Decomposition Strategies
Scenario: Multi-Agent Research System

A multi-agent research system's synthesis agent integrates findings gathered by multiple research subagents into a single coherent report.

Asked to review and integrate findings from 40 source documents in a single pass, quality degrades noticeably: early sources are represented accurately, but details from documents in the middle of the batch are frequently dropped or garbled, even though the documents individually fit well within the context window. What is the most reliable fix?

A) Switch to a model with a larger context window so all 40 documents fit more comfortably
B) Rewrite the synthesis prompt with more emphatic instructions to "carefully consider every document equally"
C) Reduce the number of source documents the research agents are allowed to gather
D) Split synthesis into per-document (or per-batch) passes plus a separate cross-document integration pass

## Q7
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.5 Iterative Refinement Techniques
Scenario: Claude Code for Continuous Integration

A CI pipeline uses Claude Code to auto-generate release-note summaries from commit messages as part of each release build.

The team keeps rewriting the prompt's prose description of "the right tone and level of detail," but the output format still varies noticeably from run to run in ways that are hard to describe precisely in words. What should they try instead?

A) Provide 2–3 concrete input/output examples showing commit messages and the exact release-note style expected
B) Have Claude ask clarifying questions before generating each release note (the interview pattern)
C) Add an instruction telling the model to "be more confident and consistent"
D) Switch the release-note generation step to plan mode before executing it

## Q8
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.3 Tool Distribution & Tool Choice
Scenario: Multi-Agent Research System

In a multi-agent research system, a coordinator routes cross-role requests between subagents so that every exchange stays observable and controlled.

The synthesis agent occasionally needs to confirm a single specific fact against a source document — a simple, high-frequency check that makes up the vast majority of its cross-role needs — but today every such check is routed back through the coordinator, adding two extra hops and noticeable latency to an otherwise straightforward step. What should the team do?

A) Give the synthesis agent the full `web_search` tool so it can verify anything on its own
B) Keep routing all verification through the coordinator to preserve full observability of every check
C) Give the synthesis agent a narrow, scoped `verify_fact` tool for this common case, and reserve coordinator routing for the rarer complex cases
D) Remove verification from the synthesis agent's responsibilities entirely and add a dedicated fact-checking subagent

## Q9
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.3 Structured Output with Tool Use
Scenario: Structured Data Extraction

A structured extraction system pulls shipment records — tracking number, carrier, estimated delivery date, delivery status — from unstructured emails using `tool_use` with a JSON schema.

Some emails don't mention an estimated delivery date at all, but because that field is marked required in the schema, the model has started inventing plausible-looking dates for those emails. What is the most reliable schema-level fix?

A) Remove the field entirely so the model never has to address delivery dates
B) Make the estimated-delivery-date field optional/nullable so the model can return a genuine null when it's absent from the source
C) Keep the field required but add a prompt instruction telling the model not to guess
D) Switch `tool_choice` from a forced tool to `auto` so the model can explain in text when a date is missing

## Q10
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.4 Workflow Enforcement & Handoff
Scenario: Customer Support Resolution Agent

A customer support resolution agent processes refunds through `process_refund`, a tool with real financial impact, after first confirming order details through `lookup_order`.

An audit shows that roughly 5% of the time, the agent calls `process_refund` before it has called `lookup_order` to confirm the order and refund eligibility — occasionally issuing refunds against the wrong order. The team needs this ordering to hold every time, not just most of the time. What is the correct fix?

A) Add a system-prompt instruction emphasizing that the agent must always verify the order before refunding
B) Add several few-shot examples showing the correct lookup-then-refund sequence
C) Add a routing classifier that decides whether a request looks refund-eligible before invoking any tools
D) Add a programmatic prerequisite gate in code that blocks `process_refund` from executing unless `lookup_order` has already succeeded for that order in this session

## Q11
Domain: 5. Context Management & Reliability
Subtopic: 5.6 Information Provenance & Multi-Source Synthesis
Scenario: Multi-Agent Research System

A multi-agent research system's synthesis agent compiles findings gathered from multiple sources into a single report, attributing claims back to where they came from.

On a report about a company's revenue growth, two credible sources disagree: one industry report (published in January) states 12% year-over-year growth, while a more recent analyst note (published in May) states 18%. The synthesis agent's draft simply states "revenue grew 18%," citing only the analyst note. What should the synthesis process do instead?

A) Present both figures with their source attribution and publication dates, noting the difference may reflect a trend across the two reporting periods rather than a contradiction
B) Always defer to the most recently published source and drop the older figure entirely
C) Average the two figures and report a single blended growth rate to avoid the appearance of conflict
D) Omit the growth figure entirely from the report since the sources disagree

## Q12
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.4 Integrating MCP Servers
Scenario: Customer Support Resolution Agent

A customer support team connects an MCP server exposing their internal ticketing system to their Claude Agent SDK application, so agents can create and update tickets on the customer's behalf.

The server needs an API token to authenticate, and a teammate initially hard-coded the token directly into `.mcp.json`, which is committed to the team's shared repository. Another engineer then moved the config to `~/.claude.json` on their own machine instead, so now the whole team can't see or use the server. What two corrections should the team make?

A) Move the server definition to `.mcp.json` for team-wide sharing, and reference the token via `${API_TOKEN}` environment-variable expansion instead of hard-coding it
B) Keep the server in `~/.claude.json` for security, and rotate the hard-coded token weekly
C) Move the server definition to `.mcp.json`, and leave the token hard-coded since `.mcp.json` is only read locally
D) Keep the server user-scoped, and wrap the hard-coded token in a custom MCP resource for read-only access

## Q13
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.6 Integrating Claude Code into CI/CD
Scenario: Claude Code for Continuous Integration

A team's CI/CD pipeline invokes Claude Code to review each pull request and post inline comments before a human reviewer signs off.

On a recent PR, the same Claude Code session that generated a bug fix was also asked to review its own diff — it reported no issues, but a human reviewer later found a real off-by-one error in the generated code. What change addresses the root cause?

A) Increase `--max-turns` so the reviewing session has more opportunities to catch its own mistake
B) Invoke a separate `claude -p` review with no prior context, rather than having the generating session review its own output
C) Ask the same session to review the diff a second time, prompting it to "be more critical this time"
D) Switch the review step from `--output-format json` to plain text so issues are easier for the model to notice

## Q14
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.7 Session State, Resumption & Forking
Scenario: Customer Support Resolution Agent

A support engineer investigates escalated cases in Claude Code sessions, running backend queries against customer accounts through several internal systems.

The engineer has been working a complex escalated case in a single session for an hour, testing several backend queries against a customer's account. Midway through, another team fixes a data pipeline bug that changes what several of those backend systems now return for this exact account, and the engineer wants to continue the investigation with the corrected data. What is the best way to proceed?

A) Run `--resume` on the saved session and trust its existing findings, since the investigation logic hasn't changed
B) Use `--fork-session` from the current point to explore the corrected data in a separate branch
C) Continue in the same session and ask the agent to "ignore any previous backend results that might now be wrong"
D) Start a fresh session with a structured summary of the case and prior findings, naming which backend systems changed, and re-query only those

## Q15
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.4 Validation & Retry Loops
Scenario: Claude Code for Continuous Integration

A CI pipeline extracts structured test-coverage summaries — file, lines covered, lines total, coverage percentage — from test-runner output using `tool_use`, feeding the results into a validator before they're posted to the PR.

The validator catches a case where `coverage_percentage` doesn't match `lines_covered / lines_total` for one file. Separately, another file's summary is missing entirely because the test runner crashed before reporting it — the raw log has no data for that file at all. What should the pipeline do for each case respectively?

A) For the mismatched percentage, treat it as a JSON syntax error and rely on the schema alone to fix it; for the missing file, retry until the model produces a plausible-looking coverage figure
B) Retry both cases the same way, re-running the original extraction prompt unchanged until it produces consistent output
C) For the mismatched percentage, retry with the original log, the failed extraction, and the specific validation error so the model recomputes it; for the missing file, return null or flag it for human review rather than retrying
D) Ignore the mismatched percentage since the schema already validated it as well-formed JSON, and retry only the missing file until data appears
