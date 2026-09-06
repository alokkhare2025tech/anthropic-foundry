# 1. The Exam’s Core Decision Rule

## When two answers seem plausible, choose the one that:

1. Fixes the root cause, not just the symptom.
2. Uses the least over-engineered reliable mechanism.
3. Uses deterministic enforcement when guarantees are required.
4. Uses Claude-native mechanisms from the guide.
5. Preserves context, provenance, and recovery paths.

## Golden tradeoff rule
| If the requirement says…                                            | Prefer…                                     | Avoid…                         |
| ------------------------------------------------------------------- | ------------------------------------------- | ------------------------------ |
| “Must always,” “must never,” “guarantee,” “financial,” “compliance” | Gate, hook, forced tool, validation, schema | Prompt-only instructions       |
| “Usually,” “prefer,” “style,” “format,” “judgment”                  | Prompt criteria, examples, descriptions     | Heavy infrastructure first     |
| “Tool selected incorrectly”                                         | Better tool descriptions/boundaries         | Router/classifier as first fix |
| “Output malformed JSON”                                             | `tool_use` + JSON schema                    | “Please return valid JSON”     |
| “Valid JSON but wrong values”                                       | Semantic validation                         | Stricter schema only           |
| “Long context losing facts”                                         | Structured state, case facts, scratchpads   | Bigger context alone           |
| “Large PR review inconsistent”                                      | Multi-pass review                           | Larger context alone           |
