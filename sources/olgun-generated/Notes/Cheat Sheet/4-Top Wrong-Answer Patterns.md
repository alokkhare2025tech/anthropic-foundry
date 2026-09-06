# 4. Top Wrong-Answer Patterns

| ❌ Reject answers that say…                          | When...                                      |
| ----------------------------------------------------- | -------------------------------------------- |
| Add more prompt instructions                          | The requirement is deterministic.            |
| Use a bigger context window                           | The issue is attention dilution, stale state, or lost provenance.  |
| Build a classifier/router                             | The immediate issue is weak tool descriptions or unclear criteria. |
| Use batch API                                         | For blocking, interactive, or pre-merge workflows.           |
| Trust model confidence                                | Unless calibrated with labeled data or used as one signal in a review workflow. |
| Return [] for failures                                | When access failed or timeout occurred.  |
| Let subagents communicate directly                    | When coordinator observability matters. |
| Ask report agent to add citations later               | Because citations must be preserved upstream.           |
| Use root CLAUDE.md for all conditional rules          | When path-specific rules are more precise.            |
| Same session reviews generated code                   | When an independent review instance is needed.  |