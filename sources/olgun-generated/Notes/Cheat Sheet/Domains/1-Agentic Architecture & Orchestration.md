# 1. Agentic Architecture & Orchestration - Domain Cheat Sheet

## 1.1 Agentic Loops

### 🔄 Core Loop

* **Call Claude** $\rightarrow$ inspect `stop_reason`
* **If `stop_reason == "tool_use"`:**
    1. Execute requested tool(s)
    2. Append `tool_result` to conversation history
    3. Call Claude again
* **If `stop_reason == "end_turn"`:**
    * Return final answer

### Must memorize
| Concept                          | Correct answer                                  |
| -------------------------------- | ----------------------------------------------- |
| Claude asks for a tool           | Continue loop; execute tool; append result      |
| Claude is done                   | `stop_reason: "end_turn"`                       |
| Tool result stored only in logs  | Wrong; Claude cannot reason over it             |
| Completion check                 | Use `stop_reason`, not assistant text           |
| “I’m done” / “final answer” text | Bad termination signal                          |
| Exact loop count as primary stop | Bad; cap is only safety fallback                |
| Fixed tool sequence              | Not agentic if Claude cannot choose next action |

### Common trap

- ❌ Stop when response.content is non-empty.
- ✅ Stop only when stop_reason == "end_turn".

---

## 1.2 Multi-Agent Orchestration
### Coordinator responsibilities:
- Decompose task
- Select subagents dynamically
- Delegate work
- Aggregate results
- Detect gaps
- Re-delegate targeted follow-up
- Route all communication

### If the question says…
| Wording clue                                           | Correct instinct                                           |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| All subagents succeeded, but report misses whole areas | Coordinator decomposition too narrow                       |
| Every request runs all subagents                       | Dynamic subagent selection                                 |
| Subagents duplicate work                               | Coordinator failed to partition scope                      |
| Synthesis draft has gaps                               | Coordinator should evaluate, re-delegate, re-run synthesis |
| Subagents communicate directly                         | Route through coordinator                                  |


### Common trap
- ❌ Subagent → Subagent direct communication
- ✅ Subagents → Coordinator → Subagents


---

## 1.3 Subagent Invocation & Context Passing
### High-yield facts:
| Item                               | Memorize                                        |
| ---------------------------------- | ----------------------------------------------- |
| Subagent spawning                  | Use `Task` tool                                 |
| Coordinator cannot spawn subagents | Check `allowedTools` includes `"Task"`          |
| Subagent context                   | Isolated; no automatic inheritance              |
| Prior findings                     | Must be explicitly passed in prompt             |
| Parallel subagents                 | Multiple Task calls in one coordinator response |
| AgentDefinition                    | Description, system prompt, allowed tools       |

### Correct subagent prompt includes:
- Goal
- Scope
- Prior findings
- Metadata
- Source references
- Known gaps
- Quality criteria
- Expected output structure

---

## 1.4 Workflow Enforcement & Handoff
### Use deterministic enforcement for business-critical order
| Requirement                    | Best mechanism                                            |
| ------------------------------ | --------------------------------------------------------- |
| Verify customer before refund  | Programmatic prerequisite gate                            |
| Refund above threshold         | Hook/interception + escalation                            |
| Multi-concern customer request | Decompose concerns, investigate each, synthesize response |
| Human handoff                  | Structured handoff summary                                |

### Structured handoff fields:
- customer_id
- verified status
- issue summary
- root cause
- order ID
- refund amount
- attempted actions
- policy trigger
- recommended action

---

## 1.5 Agent SDK Hooks

| Hook type                       | Use for                                        |
| ------------------------------- | ---------------------------------------------- |
| Outgoing tool-call interception | Block unsafe calls before execution            |
| `PostToolUse`                   | Normalize tool results before Claude sees them |

### Examples:
| Scenario                                                 | Correct answer                       |
| -------------------------------------------------------- | ------------------------------------ |
| Refund $900 but autonomous limit is $500                 | Intercept and redirect to escalation |
| Tools return Unix dates, ISO dates, numeric status codes | `PostToolUse` normalization          |
| Prompt says “don’t refund over $500”                     | Not enough                           |

---

## 1.6 Task Decomposition Strategies
| Task type                       | Best pattern                                |
| ------------------------------- | ------------------------------------------- |
| Predictable steps               | Prompt chaining                             |
| Large PR review                 | Per-file pass + cross-file integration pass |
| Open-ended legacy investigation | Dynamic adaptive decomposition              |
| Unknown dependencies            | Map structure first                         |
| Multiple interacting issues     | Group together                              |
| Independent issues              | Split apart                                 |

### Multi-pass review:
1. Per-file local issues
2. Cross-file data flow / integration
3. Deduplicate, severity, final recommendations

---

## 1.7 Session State, Resumption & Forking
| Need                                      | Correct mechanism                                      |
| ----------------------------------------- | ------------------------------------------------------ |
| Continue named investigation              | `--resume <session-name>`                              |
| Files changed since prior analysis        | Tell session exactly which files changed; re-read them |
| Prior tool results stale                  | Fresh session with structured summary                  |
| Compare two approaches from same baseline | `fork_session`                                         |
| Long session drifts generic               | Scratchpad, summaries, `/compact`, fresh session       |

---