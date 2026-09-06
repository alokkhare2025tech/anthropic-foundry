# Exam Content Outline (Blueprint)

The exam blueprint defines the content domains measured and the approximate weight of each domain on the exam. Weights reflect the relative importance of each domain to competent performance as determined through the job task analysis. The percentages indicate the approximate proportion of scored items drawn from each domain.

| Domain | Content Domain | Weight |
|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27% |
| 2 | Tool Design & MCP Integration | 18% |
| 3 | Claude Code Configuration & Workflows | 20% |
| 4 | Prompt Engineering & Structured Output | 20% |
| 5 | Context Management & Reliability | 15% |
| **Total** | | **100%** |

---

## Exam Scenarios

The exam uses scenario-based questions. Each scenario presents a realistic production context that frames a set of questions. During the exam, 4 scenarios are presented and picked at random from the full set of 6 scenarios below.

### Scenario 1: Customer Support Resolution Agent

You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (`get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`). Your target is 80%+ first-contact resolution while knowing when to escalate.

**Primary domains:** Agentic Architecture & Orchestration, Tool Design & MCP Integration, Context Management & Reliability

### Scenario 2: Code Generation with Claude Code

You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.

**Primary domains:** Claude Code Configuration & Workflows, Context Management & Reliability

### Scenario 3: Multi-Agent Research System

You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.

**Primary domains:** Agentic Architecture & Orchestration, Tool Design & MCP Integration, Context Management & Reliability

### Scenario 4: Developer Productivity with Claude

You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.

**Primary domains:** Tool Design & MCP Integration, Claude Code Configuration & Workflows, Agentic Architecture & Orchestration

### Scenario 5: Claude Code for Continuous Integration

You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.

**Primary domains:** Claude Code Configuration & Workflows, Prompt Engineering & Structured Output

### Scenario 6: Structured Data Extraction

You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.

**Primary domains:** Prompt Engineering & Structured Output, Context Management & Reliability

---

## How the Exam Is Scored

The Claude Certified Architect – Foundations exam is a criterion-referenced assessment: each candidate is measured against a fixed performance standard, not against other candidates. You pass by demonstrating the knowledge and skills defined in the blueprint, not by outperforming a percentage of peers.

**Passing standard.** The passing score was established through a formal standard-setting study in which trained subject matter experts judged the level of performance expected of a minimally qualified candidate. The score is reported on a scaled range of 100–1,000, and the cut score is **720**. Scaled scoring models help equate scores across multiple exam forms that might have slightly different difficulty levels.

**Result reporting.** Your result is reported as a pass or fail status with a scaled score from 100 to 1,000. Your score report also shows the percentage of items you answered correctly within each content domain. Section-level percentages are provided to help you understand your performance and are not used to determine your pass or fail result, which is based on your total scaled score.
