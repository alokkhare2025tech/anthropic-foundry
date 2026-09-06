# 2. Exam Scenario Map

The guide’s six scenario families are: Customer Support Resolution Agent, Code Generation with Claude Code, Multi-Agent Research System, Developer Productivity with Claude, Claude Code for CI/CD, and Structured Data Extraction.

| Scenario                           | High-yield answer patterns                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customer Support Resolution Agent  | Agentic loop, `get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`, prerequisite gates, hooks, escalation criteria, structured handoff |
| Code Generation with Claude Code   | `CLAUDE.md`, commands, skills, plan mode vs direct execution, session resume, `fork_session`, rules                                                     |
| Multi-Agent Research System        | Coordinator-subagent hub-and-spoke, Task tool, explicit context passing, provenance, structured errors, coverage gaps                                   |
| Developer Productivity with Claude | Built-in tools Read/Write/Edit/Bash/Grep/Glob, codebase exploration, MCP resources, scratchpads                                                         |
| Claude Code for CI/CD              | `claude -p`, JSON output/schema, explicit review criteria, false-positive reduction, independent review                                                 |
| Structured Data Extraction         | `tool_use`, JSON schema, nullable fields, validation-retry, batch processing, confidence calibration, human review                                      |
