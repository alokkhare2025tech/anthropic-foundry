# Exam _sample

Title: Sample — Format Reference (not a real exam)
Total: 3

## Q1
Domain: 1. Agentic Architecture & Orchestration
Subtopic: 1.7 Session State, Resumption & Forking
Scenario: Code Generation with Claude Code

A development team is breaking a legacy Java monolith into microservices with Claude Code's multi-agent features. Specialist subagents are configured through CLAUDE.md, custom hooks enforce lint rules, and agentic delegation patterns coordinate changes across hundreds of files.

A Claude Code agent has spent 30 minutes debugging a failing test suite mid-refactor, trying three different approaches that each modified configuration files. None worked, and its context now holds three sets of conflicting modifications and failed outputs. The developer wants to try a completely different strategy. What session management approach should they use?

A) Start a completely new session with no prior context at all, re-read the failing tests from scratch, and apply the new strategy fresh.
B) Use fork_session from the point before the first debugging attempt to explore the new strategy
C) Continue in the current session and ask the agent to ignore all previous attempts and start fresh
D) Start a fresh session summarising the three failed approaches and why each failed, then pursue the new strategy with clean context.

## Q2
Domain: 5. Context Management & Reliability
Subtopic: 5.1 Managing Conversation Context
Scenario: Customer Support Resolution Agent

A financial services company is building a customer support agent on Claude. It handles account enquiries and refunds, escalates the tricky cases, and talks to several backend systems through MCP tools.

A customer support agent uses a token budget of 200k tokens. The system prompt consumes 8k tokens, conversation history takes 120k tokens, and the most recent tool call result returned 65k tokens. The agent is struggling to produce thorough responses. What is the most likely cause and fix?

A) The system prompt is too large at 8k tokens and should be reduced to under 2k to leave more room for the response
B) The conversation history should be cleared entirely to give the model a fresh context for each response
C) Input already consumes 193k of the 200k budget. Summarise history or trim verbose tool results.
D) The model needs a higher max_tokens parameter to produce longer responses

## Q3
Domain: 3. Claude Code Configuration & Workflows
Subtopic: 3.5 Iterative Refinement Techniques
Scenario: Code Generation with Claude Code

A software engineering team uses Claude Code to write, review, and test code in a large TypeScript monorepo: 200+ packages, tests co-located with the source they cover, and several deployment targets.

A developer asks Claude Code to implement a rate limiter. Each iteration looks plausible, but edge cases keep surfacing in manual testing: burst traffic, clock skew, concurrent requests. Review comments fix one case and regress another. Which workflow change gives the iteration loop an objective target?

A) Use the interview pattern so Claude asks clarifying questions before each iteration
B) Describe all the edge cases in more precise prose in a single detailed message
C) Write the test suite first, then iterate by sharing the failing test output
D) Switch to plan mode so the architecture is agreed before any implementation begins