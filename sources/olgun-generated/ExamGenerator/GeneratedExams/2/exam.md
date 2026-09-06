# Exam 2

Title: CCAR-F Practice Exam 2 — Weighted Domain Spread
Total: 20

## Q1
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.1 Designing Tool Interfaces
Scenario: Developer Productivity with Claude

A developer productivity agent built on the Claude Agent SDK helps engineers navigate a large monorepo, exposing custom tools including `get_repo_structure` (returns the full directory tree with file sizes) and `get_file_history` (returns a single file's commit history, author, and last-modified date).

Engineers increasingly ask questions like "who last touched this config file and when," but the agent keeps calling `get_repo_structure` and scanning the enormous tree output for authorship information it doesn't actually contain, wasting tool calls and context. What is the most effective fix?

A) Replace both tools with a single general-purpose `get_file_info` tool so the model has one obvious choice
B) Add a few-shot example to the system prompt showing the agent calling `get_file_history` for single-file history questions
C) Rewrite both tools' descriptions to state each one's purpose and inputs, adding an explicit "use `get_file_history` NOT `get_repo_structure` for a single file's history/authorship" boundary
D) Route all file-history questions through a lightweight classifier that decides which tool to call before the agent sees the request

## Q2
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.2 Few-Shot Prompting
Scenario: Claude Code for Continuous Integration

A platform team's CI pipeline invokes Claude Code via `-p` to auto-generate unit-test stubs for newly added functions, including a short header comment summarizing what each test covers.

Despite several rounds of rewriting the prompt's prose description of "the right level of detail" for these header comments, some come back as one terse line and others as three verbose paragraphs, and reviewers can't predict which they'll get for a given function. What should the team try instead?

A) Add 2-4 worked examples showing input functions alongside the exact header-comment style and length expected
B) Instruct the model to "be more consistent" about comment length in the system prompt
C) Switch the header-comment generation step to plan mode before writing any code
D) Have Claude ask clarifying questions about the desired comment length before generating each stub

## Q3
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.1 Designing Agentic Loops
Scenario: Multi-Agent Research System

A multi-agent research system's web-search subagent runs a multi-step tool-calling loop, gathering and evaluating sources one query at a time until it judges its research complete.

The harness driving this loop currently decides whether to keep it running by checking if the subagent's response text contains a phrase like "I've found the key sources," and it has started cutting the subagent off mid-loop, in the same turn where it also issued another tool call to keep searching. What should the harness check instead?

A) Increase the iteration cap so the subagent gets more turns before the harness force-stops it
B) Check whether `response.content[0].type` is `"text"` before ending the loop
C) Set `tool_choice: "any"` for the subagent so it can never reply with completion text prematurely
D) Check the response's `stop_reason` field instead of scanning the text, and end the loop only when it signals `end_turn`

## Q4
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.1 CLAUDE.md Hierarchy & Scoping
Scenario: Developer Productivity with Claude

A team relies on a Claude Code agent to automate repetitive tasks across their codebase, and wants every engineer's session to follow the same conventions, like "always run the linter after edits" and "prefer named exports."

A senior engineer wrote these conventions into their own `~/.claude/CLAUDE.md` months ago and they've worked well ever since; when two new teammates join and use the same agent against the repo, none of the conventions apply for them at all. What is the correct fix?

A) Have each new teammate copy the same content into their own `~/.claude/CLAUDE.md`
B) Move the conventions into the project's `./CLAUDE.md` (or `.claude/CLAUDE.md`) and commit it to version control so every teammate's session loads it
C) Combine the conventions into a `.claude/rules/` file with no `paths` field so it takes precedence over the user-level file
D) Have the senior engineer's session pass the conventions to new teammates' sessions via `--resume`

## Q5
Domain: 5. Context Management & Reliability
Subtopic: 5.2 Escalation & Ambiguity Resolution
Scenario: Structured Data Extraction

A structured data extraction system pulls line items, totals, and vendor details from scanned invoices using `tool_use` with a JSON schema, escalating documents it can't confidently process to a human review queue before they reach the accounting system.

Escalation currently triggers whenever the model's self-reported confidence score for the extraction falls below 0.7, but the team has noticed the model is sometimes confidently wrong on garbled scans while also escalating plenty of clean documents whose score dipped for unrelated formatting reasons. What should the team use to decide when a document goes to human review instead?

A) Lower the self-reported confidence threshold from 0.7 to 0.5 so fewer documents are escalated
B) Raise the self-reported confidence threshold from 0.7 to 0.9 so more documents are escalated
C) Escalate on explicit conditions instead — a required field genuinely absent from the document, a value that fails validation, or an inability to extract a field after a genuine attempt — not the model's self-reported confidence
D) Keep the confidence-based trigger, but average it across the last 10 documents processed before deciding to escalate

## Q6
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.3 Subagent Invocation & Context Passing
Scenario: Multi-Agent Research System

A multi-agent research system's coordinator gathers findings from a document-analysis subagent and a web-search subagent, then hands a written brief to a synthesis subagent that produces the final cited report.

The document-analysis subagent's raw output includes each claim alongside its source document and page number, but the coordinator's brief to the synthesis subagent lists the claims as a plain bulleted list of facts with no source data. The synthesis agent's reports have started shipping without citations for these findings, and the team is considering replacing the synthesis agent entirely. What should they do instead?

A) Rewrite the brief so each claim keeps its source document and page number attached as structured data, rather than a plain list of facts
B) Give the synthesis agent a `web_search` tool so it can look up sources for the claims itself
C) Replace the synthesis agent with a larger model that is less likely to drop citations
D) Add a system-prompt instruction telling the synthesis agent to "always include citations for every claim"

## Q7
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.3 Tool Distribution & Tool Choice
Scenario: Multi-Agent Research System

A multi-agent research system's document-analysis subagent is responsible for extracting facts from provided source documents and flagging documents that need re-fetching.

To "keep things flexible," an engineer gave the document-analysis subagent all 14 tools available in the system, including the web-search subagent's search tool and the report-generation agent's formatting tool. Since then, the document-analysis subagent has started running its own redundant web searches instead of working only from the documents it was given, duplicating work the web-search subagent already does. What should the team do?

A) Leave the toolset as is, but add a system-prompt instruction telling the subagent not to use tools outside its role
B) Scope the document-analysis subagent's tools down to the 4-5 tools it actually needs for its role, removing the web-search tool
C) Add a routing classifier in front of the subagent that decides which of the 14 tools it's allowed to call per request
D) Keep all 14 tools, but set `tool_choice` to a forced document-analysis tool so it can't call web-search

## Q8
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.3 Path-Specific Rules
Scenario: Claude Code for Continuous Integration

A CI pipeline runs Claude Code reviews across a monorepo with over 200 packages, each containing its own test files interspersed among implementation files.

The team wants every `*.test.ts` file, regardless of which of the 200+ packages it lives in, reviewed against a specific convention — no skipped tests merged, assertions must be specific rather than generic truthy checks — but they don't want this convention loaded into context when Claude reviews non-test files. Where should this convention live?

A) In the root `CLAUDE.md`, since the convention applies across the whole monorepo
B) In a `.claude/rules/` file with no `paths` field, so it's always available regardless of file type
C) As a project skill invoked manually before each test-file review
D) In a `.claude/rules/` file with a `paths` field matching `**/*.test.ts`, so it loads only when Claude works with matching files

## Q9
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.5 Batch Processing Strategies
Scenario: Structured Data Extraction

A structured data extraction system processes a nightly batch of several thousand vendor invoices through the Message Batches API, extracting line items into records for the next morning's accounting review.

Last night's batch of 5,000 invoices came back with 240 failed requests scattered throughout the batch. An engineer's first instinct is to resubmit the entire batch of 5,000 to be safe. What is the more effective approach?

A) Resubmit the entire 5,000-invoice batch unchanged, since partial failures suggest a systemic issue with the whole batch
B) Switch the failed 240 invoices to the real-time synchronous API and reprocess the other 4,760 again via batch as a backup
C) Use each request's `custom_id` to identify only the 240 failed invoices and resubmit just those, with any needed modifications
D) Re-run the entire batch with `strict: true` added to the tool schema so the same failures don't recur

## Q10
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.2 Multi-Agent Orchestration
Scenario: Multi-Agent Research System

A multi-agent research system's coordinator decomposes a research question into sub-tasks and delegates each to specialized subagents in a hub-and-spoke design, and a synthesis agent compiles the results into one report.

Asked to assess "the market opportunity for a new expense-management product," the coordinator delegated one sub-task, "analyze the total addressable market size," to the document-analysis subagent, and the final report devotes four pages to market size with only a single throwaway sentence each on competitive landscape and regulatory risk. The team wants to address the root cause, not patch the symptom. What should they do first?

A) Review the coordinator's task decomposition and have it explicitly delegate separate sub-tasks for competitive landscape and regulatory risk
B) Add a fourth subagent whose job is to check the final report for completeness before it ships
C) Instruct the synthesis agent to flag when a section of the report seems underdeveloped
D) Give the document-analysis subagent a broader mandate to cover market size, competitors, and regulation all at once

## Q11
Domain: 5. Context Management & Reliability
Subtopic: 5.3 Error Propagation in Multi-Agent Systems
Scenario: Multi-Agent Research System

A multi-agent research system's web-search subagent gathers sources for the coordinator, which combines them with document-analysis findings before handing everything to the synthesis agent.

Partway through gathering sources on a topic, the web-search subagent's connection to one specific source repository times out after several already-successful queries returned useful results. The team is deciding how the subagent should handle this. What is the most reliable approach?

A) Have the subagent return `{results: [], status: "success"}` so the coordinator's pipeline doesn't need special-case error handling
B) Have the subagent abort and signal the coordinator to terminate the entire research pipeline immediately
C) Have the subagent retry the timed-out source locally a few times, and if it still fails, silently drop it and return only the successful results with no mention of the gap
D) Have the subagent retry the timed-out source locally a few times, and if it still fails, propagate a structured report to the coordinator noting the failure type, what was attempted, and the partial results already gathered

## Q12
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.7 Session State, Resumption & Forking
Scenario: Developer Productivity with Claude

An engineer uses a Claude Code session to explore an unfamiliar payments module in a large codebase, building up understanding of how several files interact across two hours of investigation.

While the engineer steps away, a teammate merges a PR that refactors 4 of the roughly 60 files the session had already examined, changing their function signatures. The engineer wants to continue the investigation using the corrected understanding of those 4 files without re-exploring the other 56. What is the best way to proceed?

A) Use `--resume` on the saved session and trust its existing findings, since only a small fraction of files changed
B) Start a fresh session with a structured summary of the investigation so far, explicitly naming the 4 changed files, and re-read only those
C) Use `--fork-session` from the current point to explore the refactored files in a separate branch
D) Continue in the same session and tell the agent to disregard anything it previously learned about those 4 files

## Q13
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.5 Selecting Built-in Tools
Scenario: Developer Productivity with Claude

An engineer uses Claude Code's built-in tools to investigate a bug in a large TypeScript codebase they haven't worked in before.

Trying to find every place that calls a specific function, `calculateShippingCost`, the agent uses Glob with a pattern matching all `.ts` files, then plans to open and scan each one individually for the function name. What tool should the agent use instead, and why?

A) Grep for `calculateShippingCost`, since finding callers means searching file contents, not file names
B) Glob for `**/*calculateShippingCost*`, since the function name might also appear in a file name
C) Read every `.ts` file returned by the current Glob search in full, since that guarantees nothing is missed
D) Bash with a shell `find` command instead, since it is faster than either Grep or Glob for this case

## Q14
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.6 Integrating Claude Code into CI/CD
Scenario: Claude Code for Continuous Integration

A CI/CD pipeline invokes Claude Code via `-p` to generate a bug fix for a flagged issue, then asks it to review its own diff before a human signs off.

The same session that wrote a fix for a slow database query also reviewed its own diff and reported it as clean, but a human reviewer later found the fix introduced a string-concatenated SQL query vulnerable to injection. What change addresses the root cause?

A) Increase `--max-budget-usd` so the reviewing session can reason more thoroughly about its own diff
B) Ask the same session to review the diff again with an instruction to focus specifically on security this time
C) Switch review output from plain text to `--output-format json` so issues are easier to parse
D) Invoke a separate `claude -p` review with no prior context on the diff, rather than having the generating session review its own output

## Q15
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.5 Agent SDK Hooks
Scenario: Developer Productivity with Claude

A developer productivity agent built on the Claude Agent SDK has access to a Bash tool for running local development commands as part of automating repetitive tasks.

The team wants two things guaranteed: any `rm -rf` command is blocked before it ever executes, and every Bash command's Unix-timestamp output is converted to ISO-8601 before the model sees it, without spending prompt tokens asking the model to do the conversion itself. Which hook design achieves both?

A) A single PostToolUse hook that both blocks disallowed commands and reformats timestamps after the command has run
B) A PreToolUse hook that reformats timestamps before the command runs, and a PostToolUse hook that blocks disallowed commands afterward
C) A PreToolUse hook that blocks `rm -rf` before execution by exiting with code 2, and a PostToolUse hook that deterministically reformats timestamps in the result before the model sees it
D) A system-prompt instruction telling the agent never to run `rm -rf`, plus a PostToolUse hook that reformats timestamps

## Q16
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.6 Multi-Instance & Multi-Pass Review
Scenario: Claude Code for Continuous Integration

A CI pipeline uses Claude Code to review pull requests before merge, including occasional large PRs touching dozens of files across a monorepo.

On a 45-file PR, the same session that just generated the refactor was asked to "review this diff very critically, looking for anything you might have missed," and it again reported no issues; a later manual review found two real bugs in files near the middle of the diff. What combination of changes addresses this?

A) Keep the same session but ask it to use extended thinking before reporting its review verdict
B) Use an independent `claude -p` review with no prior context, and split the review into per-file passes plus a separate cross-file integration pass
C) Switch to a model with a larger context window so all 45 files can be considered together in one pass
D) Ask the same session for its self-reported confidence in the review, and re-review only if confidence is below a threshold

## Q17
Domain: 2. Tool Design & MCP Integration
Subtopic: 2.2 Structured Error Responses
Scenario: Multi-Agent Research System

A multi-agent research system's web-search subagent calls an internal search-index tool to gather sources for the coordinator.

On one query, the search-index service was temporarily unreachable and the tool call errored out; on a different query, the search ran successfully but genuinely found zero matching sources. The subagent's current code catches both cases and reports the same generic result: `{results: [], status: 'ok'}`. What is wrong with this, and what should change?

A) Nothing needs to change — both cases correctly return no results, which is the right signal either way
B) Only the zero-matches case is handled correctly; the unreachable-service case should also return zero results, but marked `status: 'error'`
C) Both cases should be retried automatically a fixed number of times before returning any result
D) The two cases need to be distinguished — the unreachable service is a retryable access failure that should propagate structured error metadata, while zero matches is a valid, non-retryable empty result

## Q18
Domain: 5. Context Management & Reliability
Subtopic: 5.5 Human Review & Confidence Calibration
Scenario: Structured Data Extraction

A structured data extraction system extracts fields from several document types — domestic invoices, international invoices, and handwritten receipts — and the team is deciding how much human review to keep in place.

The system reports 97% overall extraction accuracy, and the team is close to removing human review entirely for documents where the model reports high confidence. What should they do before making that call?

A) Proceed with removing review for high-confidence documents, since 97% overall accuracy is well above their target
B) Keep reviewing only the low-confidence documents, since that's where the model is most likely to be wrong
C) Validate accuracy by document type and field segment, and use stratified sampling that includes high-confidence items, before reducing review
D) Lower the confidence threshold required to skip human review, so more documents get automated

## Q19
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.2 Custom Slash Commands & Skills
Scenario: Developer Productivity with Claude

A developer productivity setup includes a project skill that walks new engineers through tracing a request across a legacy service's call graph, printing extensive intermediate findings as it goes.

Whenever an engineer invokes this skill mid-session to understand a subsystem, its verbose intermediate output floods the main conversation, and the engineer has to scroll past pages of trace detail to get back to what they were doing before. What frontmatter option addresses this?

A) Add `context: fork` to the skill so it runs in an isolated subagent and only its final result returns to the main conversation
B) Move the skill's content into the project's `CLAUDE.md` so it's always available without needing to be invoked
C) Add `argument-hint` to the skill so it prompts for parameters before running
D) Restrict the skill's `allowed-tools` to read-only tools so it produces less output

## Q20
Domain: 4. Prompt Engineering & Structured Output
Subtopic: 4.3 Structured Output with Tool Use
Scenario: Structured Data Extraction

A structured data extraction pipeline defines a `record_invoice` tool whose JSON schema matches the invoice fields the team needs, and calls Claude with this tool available to extract each incoming invoice into a structured record.

The pipeline currently leaves `tool_choice` set to `auto`. For most invoices this works, but occasionally the model responds with a plain-text summary of the invoice instead of calling `record_invoice`, which breaks the downstream parser that expects a tool call every time. What change guarantees a tool call on every invoice?

A) Leave `tool_choice` on `auto`, but add a prompt instruction telling the model it must always call the tool
B) Set `tool_choice` to `any` (or force the specific `record_invoice` tool), and add `strict: true` to also guarantee schema-valid inputs
C) Set `tool_choice` to `none` and parse the plain-text summary into the schema afterward
D) Keep `tool_choice` on `auto`, but lower the model's temperature so it more reliably calls the tool
