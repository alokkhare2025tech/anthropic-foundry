# 5. Context Management & Reliability - Domain Cheat Sheet 

## 5.1 Managing Conversation Context
| Failure                                    | Correct answer                                |
| ------------------------------------------ | --------------------------------------------- |
| Summary changes `$849.37` to “about $800”  | Persistent case facts block                   |
| Agent forgets one issue                    | Structured issue state                        |
| Tool result has 40 fields                  | Trim to relevant fields                       |
| Important fact buried in middle            | Key findings at top + headers                 |
| Subagent verbose output overwhelms context | Structured facts, citations, relevance scores |

### Persistent case facts example
```yaml
case_facts:
  customer_id: C-78219
  verified: true
  order_id: ORD-9912
  refund_amount: 849.37
  delivery_date: 2026-06-21
  policy_trigger: refund_exceeds_threshold
```

The guide warns about progressive summarization risks, lost-in-the-middle effects, and verbose tool-result bloat; it recommends persistent case facts, structured issue data, trimming tool outputs, and placing key findings at the beginning.

---

## 5.2 Escalation Ambiguity Resolution
### Escalate when:
- Customer explicitly requests human
- Policy is ambiguous or silent
- Agent cannot make meaningful progress
- Business rule requires human review

### Do not escalate only because:
- Customer sounds angry
- Claude says low confidence
- Case seems *complex*

### Multiple customer matches:
- Ask for more identifiers.
- Do not pick by most recent order or highest spend.

---

## 5.3 Error Propagation in Multi-Agent Systems
### Subagent error should include:
- Failure type
- Attempted query
- Partial results
- Attempted recovery
- Retryability
- Alternatives
- Coverage impact

### Never:
- Return empty success on timeout
- Terminate entire workflow on one recoverable failure
- Hide access failure as no results


---

## 5.4 Context in Large Codebase Exploration
| Problem                                         | Correct pattern                   |
| ----------------------------------------------- | --------------------------------- |
| Long session gives generic “typical MVC” answer | Scratchpad / structured summaries |
| Verbose discovery fills context                 | Subagents + `/compact`            |
| Need crash recovery                             | Manifest + state exports          |
| Prior tool results stale                        | Fresh session with summary        |
| Need continue valid old investigation           | `--resume`                        |


---

## 5.5 Human Review & Confidence Calibration
| Wording clue                   | Correct answer                                                   |
| ------------------------------ | ---------------------------------------------------------------- |
| 97% overall accuracy           | Segment by document type and field                               |
| Confidence scores unvalidated  | Calibrate with labeled validation set                            |
| High-confidence errors         | Stratified sampling                                              |
| Limited reviewers              | Route low-confidence, ambiguous, contradictory, high-risk fields |
| Document-level confidence only | Use field-level confidence                                       |

---

## 5.6 Information Provenance & Multi-Source Synthesis
### Preserve:
- Claim
- Source URL / document name
- Page number
- Evidence excerpt
- Publication date
- Collection date
- Methodology context
- Confidence
- Coverage gaps

### Conflicting credible sources:
- Do not choose one arbitrarily.
- Do not average incompatible values.
- Preserve both with attribution, dates, populations, methodology.

### Different content types:
- Financial data → tables
- News → prose
- Technical findings → structured lists

---