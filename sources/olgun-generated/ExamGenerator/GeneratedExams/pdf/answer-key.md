## Q1
Correct: A
Explanation: When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.
Why-A: Correct — a programmatic prerequisite blocking lookup_order/process_refund until get_customer returns a verified ID provides a deterministic guarantee.
Why-B: Relies on probabilistic LLM compliance, insufficient when errors have financial consequences.
Why-C: Also relies on probabilistic LLM compliance via few-shot examples, not a guarantee.
Why-D: Addresses tool availability, not tool ordering — doesn't fix the actual problem.
Source: Lesson 1.4 — Workflow Enforcement & Handoff

## Q2
Correct: B
Explanation: Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses this root cause with a low-effort, high-leverage fix. Few-shot examples (A) add token overhead without fixing the underlying issue. A routing layer (C) is over-engineered and bypasses the LLM's natural language understanding. Consolidating tools (D) is a valid architectural choice but requires more effort than a "first step" warrants when the immediate problem is inadequate descriptions.
Why-A: Adds token overhead without fixing the underlying issue of vague descriptions.
Why-B: Correct — tool descriptions are the primary mechanism LLMs use for tool selection; expanding them directly fixes the root cause.
Why-C: A routing layer is over-engineered and bypasses the LLM's natural language understanding.
Why-D: A valid architectural choice, but requires more effort than warranted for a first step.
Source: Lesson 2.1 — Designing Tool Interfaces

## Q3
Correct: A
Explanation: Adding explicit escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure. Option B fails because LLM self-reported confidence is poorly calibrated—the agent is already incorrectly confident on hard cases. Option C is over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn't been tried. Option D solves a different problem entirely; sentiment doesn't correlate with case complexity, which is the actual issue.
Why-A: Correct — explicit escalation criteria with few-shot examples directly addresses the root cause of unclear decision boundaries.
Why-B: LLM self-reported confidence is poorly calibrated — the agent is already incorrectly confident on hard cases.
Why-C: Over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn't been tried.
Why-D: Solves a different problem; sentiment doesn't correlate with case complexity.
Source: Lesson 4.1 — Prompts with Explicit Criteria

## Q4
Correct: A
Explanation: Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren't shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn't exist in Claude Code.
Why-A: Correct — project-scoped slash commands in .claude/commands/ are version-controlled and automatically available to all developers on clone/pull.
Why-B: ~/.claude/commands/ is for personal commands not shared via version control.
Why-C: CLAUDE.md is for project instructions/context, not command definitions.
Why-D: Describes a configuration mechanism that doesn't exist in Claude Code.
Source: Lesson 3.2 — Custom Slash Commands & Skills

## Q5
Correct: A
Explanation: Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions—exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code. Option D ignores that the complexity is already stated in the requirements, not something that might emerge later.
Why-A: Correct — plan mode is designed for complex, large-scale changes with multiple valid approaches and architectural decisions.
Why-B: Risks costly rework when dependencies are discovered late.
Why-C: Assumes the right structure is already known without exploring the code.
Why-D: Ignores that the complexity is already stated upfront, not something emerging later.
Source: Lesson 3.4 — Plan Mode vs Direct Execution

## Q6
Correct: A
Explanation: Option A is correct because .claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location, essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching, making it unreliable. Option C requires manual skill invocation or relies on Claude choosing to load them, contradicting the need for deterministic "automatic" application based on file paths. Option D can't easily handle files spread across many directories since CLAUDE.md files are directory-bound.
Why-A: Correct — .claude/rules/ with glob patterns applies conventions automatically based on file paths regardless of directory location.
Why-B: Relies on inference rather than explicit matching, making it unreliable.
Why-C: Requires manual invocation or relies on Claude choosing to load skills, contradicting deterministic automatic application.
Why-D: Can't easily handle files spread across many directories since CLAUDE.md files are directory-bound.
Source: Lesson 3.3 — Path Specific Rules

## Q7
Correct: B
Explanation: The coordinator's logs reveal the root cause directly: it decomposed "creative industries" into only visual arts subtasks (digital art, graphic design, photography), completely omitting music, writing, and film. The subagents executed their assigned tasks correctly—the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.
Why-A: Incorrectly blames the synthesis agent, which is working correctly within its assigned scope.
Why-B: Correct — the coordinator's logs directly reveal task decomposition covering only visual arts subtasks, omitting music, writing, and film.
Why-C: Incorrectly blames the web search agent, which executed its assigned tasks correctly.
Why-D: Incorrectly blames the document analysis agent, which is working correctly within its assigned scope.
Source: Lesson 1.6 — Task Decomposition Strategies

## Q8
Correct: A
Explanation: Structured error context gives the coordinator the information it needs to make intelligent recovery decisions—whether to retry with a modified query, try an alternative approach, or proceed with partial results. Option B's generic status hides valuable context from the coordinator, preventing informed decisions. Option C suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.
Why-A: Correct — structured error context gives the coordinator what it needs to make intelligent recovery decisions.
Why-B: A generic status hides valuable context from the coordinator, preventing informed decisions.
Why-C: Suppresses the error by marking failure as success, preventing recovery and risking incomplete outputs.
Why-D: Terminates the entire workflow unnecessarily when recovery strategies could succeed.
Source: Lesson 2.2 — Structured Error Responses

## Q9
Correct: A
Explanation: Option A applies the principle of least privilege by giving the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases. Option B's batching approach creates blocking dependencies since synthesis steps may depend on earlier verified facts. Option C over-provisions the synthesis agent, violating separation of concerns. Option D relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify.
Why-A: Correct — applies least privilege by giving the synthesis agent a scoped tool for the 85% common case while preserving coordination for complex cases.
Why-B: Batching creates blocking dependencies since synthesis steps may depend on earlier verified facts.
Why-C: Over-provisions the synthesis agent with all web search tools, violating separation of concerns.
Why-D: Relies on speculative caching that cannot reliably predict what will need verification.
Source: Lesson 2.3 — Tool Distribution & Tool Choice

## Q10
Correct: A
Explanation: The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input—exactly what CI/CD pipelines require. The other options reference non-existent features (CLAUDE_HEADLESS environment variable, --batch flag) or use Unix workarounds that don't properly address Claude Code's command syntax.
Why-A: Correct — the -p (--print) flag runs Claude Code in non-interactive mode, processing the prompt and exiting without waiting for input.
Why-B: References a non-existent environment variable (CLAUDE_HEADLESS).
Why-C: A Unix stdin redirect workaround that doesn't properly address Claude Code's command syntax.
Why-D: References a non-existent --batch flag.
Source: Lesson 3.6 — Integrating Claude Code into CI/CD

## Q11
Correct: A
Explanation: The Message Batches API offers 50% cost savings but has processing times up to 24 hours with no guaranteed latency SLA. This makes it unsuitable for blocking pre-merge checks where developers wait for results, but ideal for overnight batch jobs like technical debt reports. Option B is wrong because relying on "often faster" completion isn't acceptable for blocking workflows. Option C reflects a misconception—batch results can be correlated using custom_id fields. Option D adds unnecessary complexity when the simpler solution is matching each API to its appropriate use case.
Why-A: Correct — batch processing suits overnight technical debt reports, while blocking pre-merge checks need real-time calls given the Batches API's up-to-24-hour processing with no latency SLA.
Why-B: Relying on "often faster" completion isn't acceptable for blocking workflows.
Why-C: Reflects a misconception — batch results can be correlated using custom_id fields.
Why-D: Adds unnecessary complexity when simply matching each API to its appropriate use case suffices.
Source: Lesson 4.5 — Batch Processing Strategies

## Q12
Correct: A
Explanation: Splitting reviews into focused passes directly addresses the root cause: attention dilution when processing many files at once. File-by-file analysis ensures consistent depth, while a separate integration pass catches cross-file issues. Option B shifts burden to developers without improving the system. Option C misunderstands that larger context windows don't solve attention quality issues. Option D would actually suppress detection of real bugs by requiring consensus on issues that may only be caught intermittently.
Why-A: Correct — splitting into focused per-file passes plus a separate integration pass addresses attention dilution directly.
Why-B: Shifts the burden to developers without improving the review system itself.
Why-C: Misunderstands that a larger context window doesn't solve attention quality issues.
Why-D: Would suppress detection of real bugs by requiring consensus on intermittently-caught issues.
Source: Lesson 4.6 — Multi-Instance & Multi-Pass Review
