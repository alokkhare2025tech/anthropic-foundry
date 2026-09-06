# 3. The “If You See This, Choose That” Table

| Question says…                                        | Choose…                                      |
| ----------------------------------------------------- | -------------------------------------------- |
| Agent repeats same tool after backend returned result | Append tool result to conversation           |
| Agent stops after saying “done”                       | Use `stop_reason`, not text                  |
| Tool descriptions minimal                             | Improve descriptions first                   |
| Tool returns “Operation failed”                       | Structured error metadata                    |
| No results vs permission denied confused              | Distinguish empty result from access failure |
| Too many tools per agent                              | Scope tools by role                          |
| Synthesis needs simple checks                         | Scoped `verify_fact`                         |
| Need exact first tool                                 | Forced named tool                            |
| Need some structured tool output                      | `tool_choice: "any"`                         |
| Shared MCP server                                     | `.mcp.json` with env vars                    |
| Personal MCP server                                   | `~/.claude.json`                             |
| Find file paths                                       | Glob                                         |
| Find code content                                     | Grep                                         |
| Non-unique Edit target                                | Read + Write                                 |
| Every developer should get rule                       | Project `CLAUDE.md` / repo config            |
| Personal preference                                   | `~/.claude/CLAUDE.md`                        |
| File-pattern rules                                    | `.claude/rules/` with `paths`                |
| Behavior inconsistent by dir                          | `/memory`                                    |
| Shared slash command                                  | `.claude/commands/`                          |
| Personal slash command                                | `~/.claude/commands/`                        |
| Verbose skill pollutes context                        | `context: fork`                              |
| Skill should not edit                                 | Restrict `allowed-tools`                     |
| Architecture-heavy task                               | Plan mode                                    |
| Simple known edit                                     | Direct execution                             |
| CI hangs                                              | `claude -p`                                  |
| CI needs structured findings                          | `--output-format json` + `--json-schema`     |
| Invalid JSON                                          | `tool_use` + schema                          |
| Valid JSON, wrong totals                              | Semantic validation                          |
| Field absent                                          | Nullable/null or human review                |
| Batch results out of order                            | `custom_id`                                  |
| Pre-merge blocking                                    | Synchronous, not batch                       |
| Long summary loses exact facts                        | Persistent case facts                        |
| Lost citations                                        | Claim-source mappings                        |
| Credible stats conflict                               | Preserve both with attribution               |
