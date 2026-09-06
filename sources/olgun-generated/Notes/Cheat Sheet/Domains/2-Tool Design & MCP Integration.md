# 2. Tool Design & MCP Integration - Domain Cheat Sheet 

## 2.1 Designing Tool Interfaces
Tool descriptions are the primary mechanism Claude uses for tool selection. The guide’s sample question says minimal tool descriptions should be fixed first by expanding descriptions with input formats, examples, edge cases, and boundaries.

### Good tool description includes:
- Purpose
- When to use
- When not to use
- Inputs
- Outputs
- Examples
- Edge cases
- Boundaries vs similar tools

### If the question says…
| Wording clue                            | Correct answer                    |
| --------------------------------------- | --------------------------------- |
| Minimal descriptions                    | Improve descriptions first        |
| Similar tools confused                  | Add boundaries and examples       |
| Overlapping names                       | Rename and clarify                |
| Generic tool with hidden modes          | Split into purpose-specific tools |
| System prompt keywords bias tool choice | Review prompt wording             |

---

## 2.2 Structured Error Responses
 
### ❌ Bad:
```json
{ 
  "isError": true, 
  "message": "Operation failed" 
}
```

### ✅ Good:
```json
{
  "isError": true,
  "errorCategory": "transient | validation | business | permission",
  "isRetryable": true,
  "message": "Technical explanation",
  "userFacingMessage": "Safe user explanation",
  "attemptedOperation": "...",
  "partialResults": [],
  "suggestedNextAction": "..."
}
```

| Error                     |         Retry? | Agent action                        |
| ------------------------- | -------------: | ----------------------------------- |
| transient timeout         |    Usually yes | Retry locally / alternative         |
| validation invalid input  | No until fixed | Ask for corrected input             |
| business policy violation |             No | Explain / escalate                  |
| permission denied         |     Usually no | Escalate / request access           |
| valid no results          |      Not error | Ask for more identifiers or proceed |

### ⚠️ Never hide access failure as:
```json
{ "isError": false, "results": [] }
```

---

## 2.3 Tool Distribution & Tool Choice
| Requirement                                       | Correct answer                                   |
| ------------------------------------------------- | ------------------------------------------------ |
| Too many tools                                    | Scope tools by role                              |
| Synthesis doing web research                      | Remove broad web tools; maybe give `verify_fact` |
| Frequent simple verification                      | Scoped cross-role `verify_fact`                  |
| Complex verification                              | Route through coordinator                        |
| Specific first tool required                      | Forced named tool                                |
| Structured output required, model can choose tool | `tool_choice: "any"`                             |
| Text or tool both okay                            | `tool_choice: "auto"`                            |

### tool_choice:
- auto: Claude may call tool or return text
- any: Claude must call some tool
- forced: Claude must call specific named tool

---

## 2.4 Integrating MCP Servers
| Need                                   | Correct config                    |
| -------------------------------------- | --------------------------------- |
| Shared team MCP server                 | `.mcp.json`                       |
| Personal/experimental MCP server       | `~/.claude.json`                  |
| Avoid committed secrets                | `${GITHUB_TOKEN}` / env expansion |
| Discover available docs/issues/schemas | MCP resources                     |
| Standard Jira/GitHub integration       | Existing community MCP first      |
| Team-specific workflow                 | Custom MCP server                 |

### If Claude prefers Grep over a richer MCP tool:
- ✅ Improve MCP tool descriptions and expose resources/catalogs.
- ❌ Do not disable Grep globally as first fix.

---

## 2.5 Selecting Built-in Tools
| Tool  | Use for                                                  |
| ----- | -------------------------------------------------------- |
| Grep  | Search file contents: functions, imports, error messages |
| Glob  | Find file paths by pattern: `**/*.test.tsx`              |
| Read  | Read full file                                           |
| Write | Write full file                                          |
| Edit  | Targeted change using unique anchor text                 |
| Bash  | Shell operations when appropriate                        |

### Key distinctions
- Find callers of calculateRefund → **Grep**
- Find all *.test.tsx files → **Glob**
- Unique line replacement → **Edit**
- Repeated anchor text → **Read + Write**
- Unfamiliar codebase → **Grep** entry points, then **Read** relevant files
- Wrapper re-exports → **Read** wrapper, then **Grep** exported names

---