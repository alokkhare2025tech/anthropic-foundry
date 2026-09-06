# 3. Claude Code Configuration & Workflows - Domain Cheat Sheet 
The guide’s appendix lists Claude Code concepts including CLAUDE.md hierarchy, .claude/rules/, commands, skills, context: fork, allowed-tools, argument-hint, plan mode, direct execution, /memory, /compact, --resume, fork_session, and Explore subagent. 

## 3.1 CLAUDE.md Hierarchy & Scoping
| Requirement                      | Location                                |
| -------------------------------- | --------------------------------------- |
| Personal preference              | `~/.claude/CLAUDE.md`                   |
| Shared project-wide standards    | root `CLAUDE.md` or `.claude/CLAUDE.md` |
| Directory/subtree-specific rules | directory-level `CLAUDE.md`             |
| Large modular project guidance   | `@import`                               |
| Diagnose loaded config           | `/memory`                               |

### Exam clues
| Wording                                 | Answer                                            |
| --------------------------------------- | ------------------------------------------------- |
| Every developer who clones repo         | project-level                                     |
| One developer only                      | user-level                                        |
| Only `services/payments/`               | directory-level                                   |
| Huge root file causing irrelevant rules | modularize with `@import`; move conditional rules |
| Inconsistent behavior across dirs       | `/memory`                                         |


---

## 3.2 Custom Slash Commands & Skills
| Need                                           | Mechanism                                  |
| ---------------------------------------------- | ------------------------------------------ |
| Shared slash command                           | `.claude/commands/<name>.md`               |
| Personal slash command                         | `~/.claude/commands/<name>.md`             |
| Specialized on-demand workflow                 | `.claude/skills/<skill>/SKILL.md`          |
| Users unsure arguments                         | `argument-hint`                            |
| Read-only skill                                | restrict `allowed-tools` to Read/Grep/Glob |
| Verbose exploration should not pollute context | `context: fork`                            |
| Personal skill variant                         | distinct name                              |

### Command vs skill vs memory
- Always-loaded stable rule → CLAUDE.md / rules
- Simple reusable on-demand workflow → slash command
- Specialized multi-step/tool-restricted workflow → skill

---

## 3.3 Path-Specific Rules

### Use `.claude/rules/*.md` with YAML frontmatter:

```yaml
paths:
  - "**/*.test.tsx"
```

| Requirement                 | Correct answer                  |
| --------------------------- | ------------------------------- |
| All React tests across dirs | path rule `**/*.test.tsx`       |
| All SQL migrations          | path rule `**/migrations/*.sql` |
| One subtree                 | directory-level `CLAUDE.md`     |
| Rule not applying           | `/memory` + check `paths`       |

---

## 3.4 Plan Mode vs Direct Execution
| Task                         | Use                             |
| ---------------------------- | ------------------------------- |
| Large migration              | Plan mode                       |
| Architecture decision        | Plan mode                       |
| Multi-file refactor          | Plan mode first                 |
| Multiple possible approaches | Plan mode                       |
| Simple typo                  | Direct execution                |
| Known single-file change     | Direct execution                |
| Explore before planning      | Explore subagent / forked skill |

### Pattern:
- Plan mode → inspect, propose, tradeoffs, test plan
- Direct execution → implement approved plan

---

## 3.5 Iterative Refinement Techniques
| Problem                         | Best technique                 |
| ------------------------------- | ------------------------------ |
| Expected transformation unclear | Concrete input/output examples |
| Edge cases regress              | Test-driven iteration          |
| Hidden business rules           | Interview pattern              |
| User says “make it better”      | Ask for examples or criteria   |
| Interacting issues              | Group together                 |
| Independent issues              | Split apart                    |


---

## 3.6 Integrating Claude Code into CI/CD
| CI clue                             | Correct answer                                     |
| ----------------------------------- | -------------------------------------------------- |
| Job hangs                           | `claude -p` / `--print`                            |
| Bot needs machine-readable comments | `--output-format json` + `--json-schema`           |
| CI lacks project standards          | `CLAUDE.md`                                        |
| Duplicate review comments           | Include prior findings; report only new/still-open |
| Duplicate test suggestions          | Provide existing tests                             |
| Same session reviews generated code | Independent review instance                        |

---