# K21 Academy — CCAR-F Labs: Build AI Agents

Source: https://k21academy.com/claude/ccar-f-labs-build-ai-agents/
Captured: 2026-09-06

Commercial courseware — summarised, not reproduced. This page is the clearest public
statement of the exam's logistics and of what the hands-on labs cover.

## Exam logistics

| Fact | Value |
|---|---|
| Questions | 60, multiple-choice and multiple-response |
| Time | 120 minutes |
| Scoring | Scaled 100–1,000 |
| Pass mark | 720 |
| Fee | $125 USD |
| Scenarios | 4 drawn at random from a bank of 6 |
| Validity | 12 months from award |

## Curriculum areas (33+ labs)

1. **AI agent architecture & design** — conversational vs workflow vs agentic systems;
   task decomposition; component boundaries; hub-and-spoke and pipeline multi-agent
   patterns.
2. **The Claude production stack** — how the Claude API, Agent SDK, Claude Code and MCP
   layer on top of each other, and which layer owns which responsibility.
3. **Reliability & production workflows** — error classification (tool / reasoning /
   environment), human-in-the-loop escalation, confidence assessment, timeout handling,
   structured logging, bounded retries.
4. **Tool integration** — schema design and testing; choosing between built-in, custom and
   MCP tools; tool boundary optimisation; preventing tool sprawl.
5. **Model Context Protocol** — building and connecting MCP servers; exposing resources
   and tools; authentication; stdio vs SSE transports.
6. **Context management** — persistent memory; context isolation in multi-agent systems;
   the load → work → persist pattern; preserving information across sessions.
7. **Structured outputs & validation** — JSON schema design (nested objects, arrays,
   enums); validation workflows; correction prompts; bounded retries; document extraction
   pipelines.
8. **Prompt engineering** — system prompt stress testing; few-shot optimisation against
   ground-truth datasets; production evaluation frameworks; adversarial and edge-case
   testing.
9. **Claude Code & development workflows** — CLAUDE.md configuration and precedence;
   custom slash commands and Agent Skills; Plan Mode for refactoring; CI/CD integration
   and headless automation.

## Where candidates reportedly struggle

- Lack of hands-on AI architecture experience — designing a *complete* system rather than
  reciting isolated concepts.
- Multi-agent design and agent specialisation.
- Context management across long workflows.
- Judging when a problem genuinely requires an agentic solution at all.
- Building for production conditions: failures, timeouts, invalid outputs.

The recurring exam instruction is to select the **simplest reliable architecture** that
meets the stated requirements — not the most capable one.
