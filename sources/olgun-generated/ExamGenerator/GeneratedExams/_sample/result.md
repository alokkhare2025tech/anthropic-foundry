# QUESTIONS

## 1. Agentic Architecture & Orchestration (1/1)

> 🟢 Evaluation: 1/1 (All questions were answered correctly.)

---

## 3. Claude Code Configuration & Workflows (1/1)

> 🟢 Evaluation: 1/1 (All questions were answered correctly.)

---

## 5. Context Management & Reliability (0/1)

### 5.1 Managing Conversation Context
**Q2** · your answer: A · correct: C

A customer support agent uses a token budget of 200k tokens. The system prompt consumes 8k tokens, conversation history takes 120k tokens, and the most recent tool call result returned 65k tokens. The agent is struggling to produce thorough responses. What is the most likely cause and fix?

- 🔴 Your answer (A): The system prompt is too large at 8k tokens and should be reduced to under 2k to leave more room for the response
- B) The conversation history should be cleared entirely to give the model a fresh context for each response
- 🟢 Correct (C): Input already consumes 193k of the 200k budget. Summarise history or trim verbose tool results.
- D) The model needs a higher max_tokens parameter to produce longer responses

Why-A: The 8k system prompt is a small fraction of the 200k budget; shrinking it barely helps when the tool result and history are the real 185k driver.
Why-B: Clearing history entirely would lose transactional facts and case context the agent still needs, an over-correction when trimming/summarizing would preserve what matters.
Why-C: Correct — input already consumes 193k of the 200k budget; summarizing conversation history or trimming the verbose 65k tool result frees the room the response needs.
Why-D: max_tokens caps output length; it does not free up the input budget already consumed by the system prompt, history, and tool result.

**Where this comes from:** Lesson 5.1 — Managing Conversation Context

---

# RESULT

**Score:** 758/1000 · PASSED · 2 of 3 correct (67%) · Pass mark: 720

| Domain | Correct | Points |
|--------|---------|--------|
| D1 Agentic Architecture & Orchestration | 1/1 (100%) | +435 |
| D3 Claude Code Configuration & Workflows | 1/1 (100%) | +323 |
| D5 Context Management & Reliability | 0/1 (0%) | +0 |
