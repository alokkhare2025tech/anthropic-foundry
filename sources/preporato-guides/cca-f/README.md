# CCA-F: Claude Certified Architect - Foundations

The original Anthropic certification (launched March 12, 2026) and the credential for people who build production-grade Claude systems end to end: agentic architectures, multi-agent orchestration, prompt and context engineering for reliability, and the tools and MCP servers agents depend on.

Where [CCDV-F](../ccdv-f/) certifies platform mechanics, CCA-F certifies the assembly of those mechanics into working systems.

> **[📖 The Complete CCA-F Study Guide](./guide.md)**: the full preparation guide with 8 technology chapters, per-domain exam notes, worked questions, anti-patterns, and exam-day strategy. This page is the summary; the guide is the study material.
>
> **Jump straight in:** [20 free questions](https://preporato.com/free/claude-certified-architect/questions?utm_source=github&utm_medium=readme&utm_campaign=cca-f) · [Practice tests](https://preporato.com/certificates/claude-certified-architect?utm_source=github&utm_medium=readme&utm_campaign=cca-f#practice-tests) · [Flashcards](https://preporato.com/certificates/claude-certified-architect?utm_source=github&utm_medium=readme&utm_campaign=cca-f#flashcards) · [Hands-on projects](https://preporato.com/certificates/claude-certified-architect?utm_source=github&utm_medium=readme&utm_campaign=cca-f#projects)
>
> **At a glance:** 8 chapters · 17 code examples · 12 worked questions · ~9,200 words

## Quick facts

| | |
|---|---|
| Price | $125 per attempt |
| Questions | 60 (all scored) |
| Duration | 120 minutes |
| Passing score | 720 on a 100-1000 scaled score |
| Delivery | Pearson VUE, test center or online proctored |
| Validity | 1 year, free renewal assessment before expiration |
| Recommended experience | Hands-on experience building Claude or agent systems |

## Exam domains

| Domain | Weight |
|--------|--------|
| Agentic Architecture & Orchestration | 27% |
| Claude Code | 20% |
| Prompt Engineering | 20% |
| Tool Design & MCP | 18% |
| Context Management & Reliability | 15% |

Two things stand out in this blueprint:

- **The 20% Claude Code weight makes CCA-F the most Claude-Code-intensive exam in the program.** Expect working fluency with the configuration hierarchy, subagents, hooks, and Skills, well beyond "I have used it once".
- **Agentic architecture is the center of gravity.** Systems where the model plans and executes multi-step work using tools, and the orchestration of multiple agents, carry more than a quarter of the exam.

## The scenario-anchored format

CCA-F has a distinctive structure: its question pool is organized around **six production scenarios, and each sitting draws four of them**, attaching questions to those running systems. A question about a context-management failure or a tool-design flaw arrives inside a concrete system description rather than as an isolated definition.

This rewards candidates who can hold a whole architecture in their head. Practicing with isolated flashcard-style questions alone will leave you unprepared for the feeling of reasoning inside a running system; make sure some of your practice mirrors the scenario format.

## Study path (~30 days part-time)

1. **Week 1: official baseline.** Join the [Claude Partner Network](https://claude.com/partners) (free), complete the Partner Academy architect-track courses, and read the official exam guide for the domain list.
2. **Weeks 2-3: build.** Work through [docs.anthropic.com](https://docs.anthropic.com) on agents, tool use, and MCP while building something real: an agent with tools, an MCP server, a Claude Code workflow with subagents and hooks. The exam writes questions from production judgment, and building is how you acquire it.
3. **Week 4: calibrate.** Take full-length, timed practice tests in the scenario-anchored format, review the per-domain breakdown, and spend the remaining days on your weakest two domains.

## Common mistakes

- Underestimating the Claude Code domain. Engineers who build agents through the API alone routinely lose most of a fifth of the exam here.
- Preparing with definitions instead of systems. The scenario format punishes memorization-first preparation.
- Letting the credential lapse after passing: the renewal assessment is free before the 12-month mark, and a full-price proctored retake after it.

## Resources

**Official (free):**
- [Anthropic Partner Academy](https://claude.com/partners): courses and exam registration
- [docs.anthropic.com](https://docs.anthropic.com): agents, tool use, MCP, Claude Code

**Free articles:**
- [CCA-F complete guide](https://preporato.com/blog/claude-certified-architect-complete-guide-2026)
- [30-day study plan](https://preporato.com/blog/cca-f-study-plan-30-day-preparation)
- [CCA-F vs CCAR-P: which to take](https://preporato.com/blog/cca-f-vs-ccar-p-which-claude-certification-2026)

**Practice ([preporato.com/certificates/claude-certified-architect](https://preporato.com/certificates/claude-certified-architect)):**
- [20 free practice questions](https://preporato.com/free/claude-certified-architect/questions?utm_source=github&utm_medium=readme&utm_campaign=cca-f) in the real exam format
- (Paid) [Six full-length scenario-format practice tests and a 500-card flashcard deck](https://preporato.com/certificates/claude-certified-architect?utm_source=github&utm_medium=readme&utm_campaign=cca-f) built on the exact domain weights
- (Paid) [11 hands-on projects](https://preporato.com/certificates/claude-certified-architect?utm_source=github&utm_medium=readme&utm_campaign=cca-f): build-and-submit work (agentic loops, hub-and-spoke systems, MCP servers, extraction pipelines) graded automatically against a rubric
