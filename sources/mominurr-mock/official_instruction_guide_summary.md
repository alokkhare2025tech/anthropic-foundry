### Summary of Claude Certified Architect – Foundations Certification Exam Guide

The **Claude Certified Architect – Foundations certification** validates proficiency in designing and implementing production-grade applications using the Claude ecosystem. This includes mastery of **Claude Code, Claude Agent SDK, Claude API, and Model Context Protocol (MCP)**—the foundational technologies for building agentic systems, developer tools, and data extraction workflows at scale.

---

### Target Candidate Profile

- **Role:** Solution architects experienced in building production applications with Claude.
- **Experience:** Typically 6+ months practical hands-on use of Claude APIs, Agent SDK, Claude Code, and MCP.
- **Key Skills:**
  - Building **multi-agent orchestration systems** using Claude Agent SDK.
  - Configuring Claude Code with **CLAUDE.md files, Agent Skills, MCP server integrations**.
  - Designing **MCP tool/resource interfaces** for backend integration.
  - Engineering prompts for **structured, reliable JSON output** using schemas and few-shot examples.
  - Managing **context windows** for long documents, multi-turn conversations, and multi-agent handoffs.
  - Integrating Claude into **CI/CD pipelines** for automated code review, test generation, and pull request feedback.
  - Implementing **escalation, reliability, and human-in-the-loop workflows**.

---

### Exam Format and Scoring

- **Question Type:** Multiple choice; one correct answer per question.
- **Scoring:** Scaled score 100–1,000; passing score is 720.
- **No penalty for guessing; unanswered questions count as incorrect.**

---

### Exam Content Domains and Weightings

| Domain                                      | Weighting (%) |
|---------------------------------------------|---------------|
| 1. Agentic Architecture & Orchestration     | 27            |
| 2. Tool Design & MCP Integration             | 18            |
| 3. Claude Code Configuration & Workflows    | 20            |
| 4. Prompt Engineering & Structured Output    | 20            |
| 5. Context Management & Reliability           | 15            |

---

### Exam Scenarios (4 randomly selected from 6)

- **Customer Support Resolution Agent:** Building agents handling ambiguous requests with backend MCP tools; focus on orchestration and reliability.
- **Code Generation with Claude Code:** Using Claude Code for software development workflows, integrating with CLAUDE.md and CI/CD pipelines.
- **Multi-Agent Research System:** Coordinating specialized subagents for web search, document analysis, synthesis, and report generation.
- **Developer Productivity Tools:** Agents assisting with codebase exploration and automation using built-in tools and MCP integration.
- **Claude Code for Continuous Integration:** Automating code reviews, test generation, and PR feedback with prompt engineering.
- **Structured Data Extraction:** Extracting validated structured data from unstructured sources with JSON schemas and error handling.

---

### Core Domain Knowledge and Skills

#### Domain 1: Agentic Architecture & Orchestration

- **Agentic Loop Lifecycle:** Control flow via stop_reason ("tool_use" to continue, "end_turn" to finish).
- **Multi-Agent Orchestration:** Hub-and-spoke coordinator manages subagent tasks, context passing, error handling, and iterative refinement.
- **Subagent Context Management:** Explicit context passing; subagents do not inherit coordinator history automatically.
- **Multi-Step Workflows:** Programmatic enforcement for critical sequences, structured handoffs for escalation.
- **Agent SDK Hooks:** Intercept tool calls/results for data normalization and enforcement of compliance rules.
- **Task Decomposition:** Adaptive vs fixed sequential pipelines for managing complex workflows.
- **Session Management:** Session resumption, forking for parallel explorations, handling stale contexts.

#### Domain 2: Tool Design & MCP Integration

- **Tool Interface Design:** Clear, unambiguous tool descriptions including inputs, examples, and boundaries to improve tool selection reliability.
- **Error Handling:** Structured error responses (errorCategory, isRetryable) for transient, validation, business, and permission errors.
- **Tool Distribution:** Scoped tool sets per agent to avoid misuse; tool_choice options ("auto", "any", forced).
- **MCP Server Configuration:** Project-level (.mcp.json) vs user-level (~/.claude.json) servers; environment variable expansion for credentials.
- **Built-in Tools:** Read, Write, Edit, Grep, Glob, Bash usage for codebase exploration and modification.

#### Domain 3: Claude Code Configuration & Workflows

- **CLAUDE.md Hierarchy:** User (~/.claude/CLAUDE.md), project (.claude/CLAUDE.md), directory-level configurations.
- **Modular Configuration:** Using @import syntax and .claude/rules/ with path-scoping via glob patterns.
- **Slash Commands & Skills:** Project vs user scope, context: fork for isolation, allowed-tools restrictions.
- **Plan Mode vs Direct Execution:** Plan mode for complex, multi-file architectural changes; direct execution for simple, scoped tasks.
- **Iterative Refinement:** Use concrete input/output examples, test-driven iteration, and interview pattern for progressive improvement.
- **CI/CD Integration:** Run Claude Code with non-interactive flags (-p), enforce structured JSON output, incremental review context.

#### Domain 4: Prompt Engineering & Structured Output

- **Explicit Criteria:** Define clear issue reporting criteria to reduce false positives and maintain developer trust.
- **Few-Shot Prompting:** Use targeted examples to improve output consistency, handle ambiguous cases, and reduce hallucination.
- **Structured Output Enforcement:** Use tool_use with JSON schemas to guarantee syntactically valid structured data; handle optional/nullable fields, enums with extensibility.
- **Validation and Retry Loops:** Provide feedback on validation errors to guide retries; distinguish between retryable errors and absent data.
- **Batch Processing:** Use Message Batches API for latency-tolerant workloads (overnight reports), handle failures by custom_id.
- **Multi-Pass Review:** Use independent instances for review to avoid self-bias; split large reviews into file-level and integration passes.

#### Domain 5: Context Management & Reliability

- **Context Preservation:** Extract and persist key transactional facts separately from summarized history to avoid "lost in the middle" effects.
- **Escalation Patterns:** Explicit escalation criteria, honor customer requests, avoid sentiment-based escalation proxies.
- **Error Propagation:** Return structured error context to enable coordinator recovery; differentiate access failures from empty valid results.
- **Large Codebase Exploration:** Use scratchpad files, subagent delegation, structured state persistence for crash recovery.
- **Human Review & Confidence Calibration:** Stratified sampling, field-level confidence scores, routing low-confidence cases to human reviewers.
- **Information Provenance:** Preserve claim-source mappings, handle conflicting data explicitly with source annotations, include temporal metadata.

---

### Sample Exam Questions Highlights

- **Tool Call Sequencing:** Enforce critical tool order with programmatic prerequisites rather than prompt instructions for deterministic business logic.
- **Tool Description Enhancement:** Expand minimal tool descriptions with input formats and examples to improve tool selection reliability.
- **Escalation Calibration:** Add explicit escalation criteria with few-shot examples instead of relying on agent confidence or sentiment analysis.
- **Configuration Files:** Project-level slash commands belong in `.claude/commands/` for version control sharing.
- **Plan Mode Usage:** Use plan mode for multi-file, architectural refactoring tasks for safe exploration and design.
- **Path-Specific Rules:** Use `.claude/rules/` with YAML frontmatter and glob patterns for applying conventions across scattered files.
- **Coordinator Task Decomposition:** Avoid overly narrow decomposition that causes coverage gaps; coordinator must dynamically select subagents.
- **Error Propagation:** Return structured error context for coordinator to make recovery decisions rather than suppressing or terminating workflows.
- **Verification Tool Scope:** Provide specialized verification tools for common cases to reduce latency and maintain separation of concerns.
- **CI Pipeline Automation:** Use `-p` flag for non-interactive Claude Code execution in pipelines.
- **Batch API Usage:** Use batch API for non-blocking workflows but keep real-time API for blocking pre-merge checks.
- **Multi-Pass Reviews:** Split large code reviews into focused passes to maintain review quality and consistency.

---

### Recommended Preparation Exercises

- Build multi-tool agents incorporating escalation logic and structured error handling.
- Configure Claude Code for team workflows with hierarchical CLAUDE.md, path-specific rules, custom skills, and MCP integration.
- Design structured data extraction pipelines using JSON schemas, validation-retry loops, few-shot examples, and batch processing.
- Develop and debug multi-agent research pipelines with subagent orchestration, error propagation, provenance tracking, and synthesis.

---

### Appendix: Key Technologies and Concepts

| Technology / Concept            | Description                                                                                   |
|-------------------------------|-----------------------------------------------------------------------------------------------|
| Claude Agent SDK              | Agent definitions, agentic loops, stop_reason handling, hooks, subagent spawning via Task tool |
| Model Context Protocol (MCP)  | MCP servers/tools/resources, error handling, .mcp.json configuration, environment variable expansion |
| Claude Code                  | CLAUDE.md hierarchy, .claude/rules/, .claude/commands/, .claude/skills/, plan mode, direct execution |
| Claude Code CLI              | -p/--print flags, --output-format json, --json-schema for structured output                    |
| Claude API                   | tool_use with JSON schemas, tool_choice options, stop_reason values                            |
| Message Batches API          | Batch processing with cost savings, latency tradeoffs, custom_id for request correlation       |
| JSON Schema & Pydantic       | Schema validation, handling required/optional fields, semantic validation errors, retry loops  |
| Built-in Tools               | Read, Write, Edit, Bash, Grep, Glob for file operations and searches                           |
| Prompt Engineering           | Few-shot prompting, explicit criteria, interview pattern, multi-pass review architectures      |
| Context Management           | Token budget optimization, scratchpads, session resumption, fork_session                      |
| Confidence Scoring           | Field-level confidence, calibration, stratified sampling for error measurement                 |

---

### Out-of-Scope Topics

- Model fine-tuning or training, authentication and billing, infrastructure deployment of MCP servers, internal Claude architecture, safety training methodologies, embedding/vector DB details, image analysis, streaming APIs, rate limiting, cloud provider specifics, benchmarking, prompt caching implementation, tokenization specifics.

---

### Key Takeaways

- **The exam rigorously tests applied knowledge and practical judgment in building scalable, reliable Claude-based applications**.
- **Multi-agent orchestration, clear tool interface design, structured output enforcement, and context management are critical competency areas**.
- **Effective prompt engineering, error handling, escalation protocols, and CI/CD integration distinguish expert practitioners**.
- **Hands-on experience combined with targeted study of the exam guide's domains and scenarios is essential for success**.

---

**This guide serves as a comprehensive roadmap for mastering foundational Claude technologies and architecting robust AI-powered solutions suitable for real-world production environments.**