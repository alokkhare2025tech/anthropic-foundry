## Q1
Correct: D
Explanation: The context holds three sets of conflicting modifications and failed outputs — a stale/poisoned context, not just a stale-files problem. The fix is a fresh session carrying only a structured summary of what was tried and why it failed, discarding the conflicting state while keeping the learning.
Why-A: Discards the knowledge of what was already tried, risking the new strategy repeating a mistake one of the three failed attempts already made.
Why-B: fork_session branches from the current conversation state, not a clean point before the attempts — the fork still inherits the same conflicting modifications and failed outputs; forking is for exploring divergent paths from a valid shared baseline, not for escaping a poisoned one.
Why-C: Asking the agent to "ignore" prior attempts doesn't remove the conflicting modifications and failed outputs still sitting in context — the poisoned state remains and can still influence the model.
Why-D: Correct — a fresh session given a structured summary of the three failed approaches and why each failed preserves the learning while discarding the conflicting, poisoned context, so the new strategy starts clean.
Source: Lesson 1.7 — Session State, Resumption & Forking

## Q2
Correct: C
Explanation: System prompt (8k) + history (120k) + the latest tool result (65k) already total 193k of the 200k budget, leaving almost no room for a thorough response. The fix is to reduce input tokens — summarize history or trim the verbose tool result — not to touch the system prompt, wipe history, or raise an output parameter.
Why-A: The 8k system prompt is a small fraction of the 200k budget; shrinking it barely helps when the tool result and history are the real 185k driver.
Why-B: Clearing history entirely would lose transactional facts and case context the agent still needs, an over-correction when trimming/summarizing would preserve what matters.
Why-C: Correct — input already consumes 193k of the 200k budget; summarizing conversation history or trimming the verbose 65k tool result frees the room the response needs.
Why-D: max_tokens caps output length; it does not free up the input budget already consumed by the system prompt, history, and tool result.
Source: Lesson 5.1 — Managing Conversation Context

## Q3
Correct: C
Explanation: Edge cases (burst traffic, clock skew, concurrent requests) are the kind of gap test-driven iteration is built for — sharing concrete failing-test output gives each iteration an unambiguous, objective target instead of prose that can be reinterpreted differently each round.
Why-A: The interview pattern surfaces missing considerations in unfamiliar domains before writing code; here the edge cases are already known and surfacing more up front won't stop the fix-one/regress-another cycle.
Why-B: More precise prose is the same blunt technique that already produced inconsistent fixes; it doesn't give the iteration an objective, checkable target.
Why-C: Correct — writing the test suite first and iterating against failing-test output gives every iteration an unambiguous, objective signal for whether burst traffic, clock skew, and concurrency edge cases are actually fixed.
Why-D: Plan mode agrees the architecture up front; it doesn't address edge cases that only surface during implementation and manual testing.
Source: Lesson 3.5 — Iterative Refinement Techniques
