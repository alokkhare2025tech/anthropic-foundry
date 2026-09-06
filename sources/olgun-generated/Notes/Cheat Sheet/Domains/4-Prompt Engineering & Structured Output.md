# 4. Prompt Engineering & Structured Output - Domain Cheat Sheet 

## 4.1 Prompts with Explicit Criteria

### Vague:
---
>- Be conservative.
>- Only report high-confidence findings.
>- Check comments for accuracy."

### Better:
---
>*Report only*:
>- correctness bugs with concrete failing path
>- reachable security issues
>- missing tests for changed business-critical behavior
>
>*Skip*:
>- style preferences
>- speculative performance
>- local patterns
>- already-covered test cases
>
>If one category is noisy: 
>- Temporarily disable that category while improving criteria.
>
>Severity labels inconsistent: 
>- Define severity levels with concrete examples.
>
---
The guide says vague instructions like “be conservative” are weaker than categorical report/skip criteria, and high false positives damage developer trust.

---

## 4.2 Few-Shot Prompting
Use 2–4 targeted examples.

### Best for:
- Consistent output format
- Ambiguous-case handling
- False-positive reduction
- Varied document structures
- Reducing hallucination

### Good examples show:
- Input
- Desired output
- Why correct
- Tempting wrong alternative

---

## 4.3 Structured Output with Tool Use

### Schema design
| Need                                         | Schema pattern       |
| -------------------------------------------- | -------------------- |
| Field may be missing                         | optional / nullable  |
| Unknown clear category                       | `"other"` + detail   |
| Ambiguous category                           | `"unclear"`          |
| Specific first extraction                    | forced named tool    |
| Unknown doc type, structured output required | `tool_choice: "any"` |
| Valid JSON but wrong values                  | semantic validation  |

- ❌ “Please return valid JSON”
- ✅  tool_use + JSON schema

---

## 4.4 Validation & Retry Loops
| Failure                         | Best response                              |
| ------------------------------- | ------------------------------------------ |
| Format mismatch                 | Retry with specific feedback               |
| Wrong field placement           | Retry with specific feedback               |
| Total mismatch                  | Semantic validation; retry if recoverable  |
| Source info absent              | Do not retry forever; null or human review |
| Contradictory source values     | `conflict_detected`, explanation, review   |
| False-positive pattern analysis | Add `detected_pattern`                     |


### Retry prompt includes:
- Original document
- Failed extraction
- Specific validation error
- Instruction to correct or mark conflict/absence

---

## 4.5 Batch Processing Strategies
| Workload                  | Use                               |
| ------------------------- | --------------------------------- |
| Overnight report          | Message Batches API               |
| Weekly audit              | Message Batches API               |
| Blocking pre-merge check  | Synchronous API                   |
| Interactive user flow     | Synchronous API                   |
| Need response correlation | `custom_id`                       |
| Some batch docs fail      | Resubmit only failed `custom_id`s |
| Multi-turn tool calling   | Not batch inside one request      |


The guide lists Message Batches API concepts including cost savings, up to a 24-hour window, custom_id, and no multi-turn tool calling support.

---

## 4.6 Multi-Instance & Multi-Pass Review
| Scenario                                   | Correct answer                                |
| ------------------------------------------ | --------------------------------------------- |
| Same session generated code and reviews it | Independent review instance                   |
| Large PR shallow/contradictory             | Per-file pass + integration pass              |
| Cross-file bug missed                      | Separate integration pass                     |
| Need calibrated routing                    | Verification pass with confidence per finding |


---
