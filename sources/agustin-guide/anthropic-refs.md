# CCA-F — Anthropic Official Sources, Exam-Ready Notes

> Companion to [`cheatsheet.md`](./cheatsheet.md). These are the two Anthropic engineering pages most cited as essential reading for the Multi-Agent Research scenario, condensed and quoted for exam recall.
>
> **Sources:**
> 1. `anthropic.com/engineering/multi-agent-research-system` — production multi-agent architecture lessons
> 2. `platform.claude.com/cookbook/claude-agent-sdk-00-the-one-liner-research-agent` — SDK API surface

---

## PART 1 — Multi-Agent Research System (Anthropic Engineering)

### The canonical pattern: orchestrator-worker

> "Orchestrator-worker pattern, where a **lead agent coordinates the process while delegating to specialized subagents that operate in parallel**."

The lead agent:
1. Analyzes the incoming query
2. Develops a research strategy
3. Spawns multiple subagents to explore different aspects simultaneously
4. Aggregates findings into a final answer

**Why this beats single-agent:** "A multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents **outperformed single-agent Claude Opus 4 by 90.2%** on our internal research eval."

### When multi-agent is the RIGHT fit

- High parallelization potential (independent subtasks)
- Information exceeding any single context window
- Complex tool interactions benefiting from per-agent specialization
- **Breadth-first** queries pursuing multiple independent directions simultaneously

### When multi-agent is the WRONG fit (exam trap)

> "Some domains that require **all agents to share the same context** or involve **many dependencies between agents** are not a good fit for multi-agent systems today."

Primary anti-example: **coding tasks**, because they "involve fewer truly parallelizable tasks than research."

**Economic constraint (quote this to yourself before any 'multi-agent' answer):** "Multi-agent systems require tasks where the **value of the task is high enough to pay for the increased performance**."

### Documented failure modes (memorise — these are distractor wording on the exam)

| Failure mode | Mechanism |
|---|---|
| **Subagent over-spawning** | "Spawning **50 subagents for simple queries**" |
| **Endless scouring** | "Scouring the web endlessly for nonexistent sources" |
| **Mutual distraction** | "Distracting each other with excessive updates" |
| **Continuation when done** | Continuing research "when they already had sufficient results" |
| **Verbose query syndrome** | "Using overly verbose search queries" with few results |
| **Tool mis-selection** | "Selecting incorrect tools" |
| **Misinterpretation / duplication** | "Subagents misinterpreted the task or **performed the exact same searches** as other agents" |
| **Division-of-labor failure** | "One subagent explored the 2021 automotive chip crisis while 2 others duplicated work investigating current 2025 supply chains" |
| **Source-quality bias** | "Consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources like academic PDFs or personal blogs" |
| **Slack-vs-web mismatch** | "An agent searching the web for context that only exists in Slack is doomed from the start" |
| **Bad tool descriptions** | "Bad tool descriptions can send agents down completely wrong paths" |

### Token economics (memorise the multipliers)

| Interaction type | Token usage vs chat |
|---|---|
| Chat | 1× (baseline) |
| Agent (single) | **~4× more tokens than chat** |
| Multi-agent | **~15× more tokens than chats** |

> "Three factors explained **95% of the performance variance** in the BrowseComp evaluation… **token usage by itself explains 80% of the variance**, with the number of tool calls and the model choice as the two other explanatory factors."

**Counter-intuitive scaling fact:** "Upgrading to Claude Sonnet 4 is a larger performance gain than **doubling the token budget** on Claude Sonnet 3.7." → Model capability > raw tokens.

### Scaling effort embedded in prompts (not left to the agent)

| Query type | Subagents | Tool calls each |
|---|---|---|
| Simple fact-finding | 1 | 3–10 |
| Direct comparisons | 2–4 | 10–15 |
| Complex research | 10+ | clearly divided responsibilities |

> "We embedded scaling rules in the prompts" — i.e., don't let the agent guess how much effort to spend; give it explicit thresholds.

### Delegation contract

> "Each subagent needs **an objective, an output format, guidance on the tools and sources to use, and clear task boundaries**."

Short instructions like "research the semiconductor shortage" are insufficient.

### Tool-selection heuristics (prompt the agent with these)

- Examine **all available tools first**
- Match tool usage to user intent
- Search the web for **broad external exploration**
- Prefer **specialized tools over generic ones**

### Parallel tool calling (90% speedup)

> "(1) The lead agent spins up **3–5 subagents in parallel** rather than serially; (2) the subagents use **3+ tools in parallel**. These changes **cut research time by up to 90%** for complex queries."

### LLM-as-judge eval rubric (5 criteria)

| Criterion | What it measures |
|---|---|
| **Factual accuracy** | Do claims align with cited sources? |
| **Citation accuracy** | Do cited sources actually support the claims? |
| **Completeness** | Are all requested aspects covered? |
| **Source quality** | Primary sources over secondary? |
| **Tool efficiency** | Correct tools, reasonable number of times? |

**Critical operational finding:** "A **single LLM call with a single prompt outputting scores from 0.0–1.0 and a pass-fail grade** was the most consistent and aligned with human judgements." → Don't deploy multiple judges per component.

**Sample size for early evals:** "About **20 queries representing real usage patterns**" allows rapid iteration when "changes tend to have dramatic impacts because there is abundant low-hanging fruit."

**Human eval still required:** "People testing agents find edge cases that evals miss," including hallucinated answers on unusual queries, system failures, and "subtle source selection biases."

### Rainbow deployments + stateful agents

> "Agent systems are **highly stateful webs of prompts, tools, and execution logic** that run almost continuously. This means that whenever we deploy updates, agents might be anywhere in their process."

**Rainbow deployment definition:** "Gradually shifting traffic from old to new versions while keeping both running simultaneously" — to avoid disrupting running agents mid-process.

**Resume-from-failure pattern:** "We can't just restart from the beginning: restarts are expensive and frustrating for users. Instead, we built systems that can **resume from where the agent was when the errors occurred**."

**Hybrid recovery:** "Letting the agent know when a tool is failing and letting it adapt works surprisingly well. We combine the **adaptability of AI agents** with **deterministic safeguards like retry logic and regular checkpoints**."

### Observability for non-deterministic agents

> "Agents make dynamic decisions and are non-deterministic between runs, **even with identical prompts**. This makes debugging harder."

Solution: full production tracing, monitoring agent **decision patterns and interaction structures** — without monitoring conversation contents (privacy).

### Compression-through-parallelism insight (likely exam quote)

> "The essence of search is **compression**: distilling insights from a vast corpus. Subagents facilitate compression by operating in parallel with their own context windows, exploring different aspects of the question simultaneously before **condensing the most important tokens** for the lead research agent."

### Synchronous bottleneck (current limitation)

> "Lead agents execute subagents **synchronously**, waiting for each set of subagents to complete before proceeding. This simplifies coordination, but **creates bottlenecks** in the information flow between agents."

Asynchronous would help but adds "challenges in result coordination, state consistency, and error propagation."

### Self-improving prompt engineering

> "Claude 4 models can be excellent prompt engineers. When given a prompt and a failure mode, they are able to **diagnose why the agent is failing and suggest improvements**." A tool-testing agent improved tool descriptions, "resulting in a **40% decrease in task completion time** for future agents using the new description."

### One-line summary (memorise verbatim)

> "**Multi-agent systems work mainly because they help spend enough tokens to solve the problem.**"

---

## PART 2 — Claude Agent SDK: query() vs ClaudeSDKClient

### The two SDK entry points

```python
from claude_agent_sdk import ClaudeAgentOptions, query, ClaudeSDKClient
```

| API | Stateful? | Use it for |
|---|---|---|
| `query(prompt, options=...)` | **No** (single-turn, no memory) | One-off research, parallel independent tasks, fresh context each call |
| `ClaudeSDKClient(options=...)` | **Yes** (multi-turn within `async with`) | Multi-turn investigations, iterative refinement, follow-up that depends on prior answer |

### Stateless example (`query`)

```python
async for msg in query(
    prompt="Research latest trends in AI agents and give me a summary with citations.",
    options=ClaudeAgentOptions(model=MODEL, allowed_tools=["WebSearch"]),
):
    print_activity(msg)
```

Each call is **independent — no context carryover**. If you ask "What are the top AI startups?" then "How are they funded?", the second `query()` has **no idea which startups you meant**.

### Stateful example (`ClaudeSDKClient`)

```python
async with ClaudeSDKClient(
    options=ClaudeAgentOptions(
        model=MODEL,
        cwd="research_agent",
        system_prompt=RESEARCH_SYSTEM_PROMPT,
        allowed_tools=["WebSearch", "Read"],
        max_buffer_size=10 * 1024 * 1024,
    )
) as research_agent:
    await research_agent.query("Analyze the chart in projects_claude.png")
    async for msg in research_agent.receive_response():
        ...
    # Follow-up that depends on the previous turn:
    await research_agent.query("Based on that chart, search for recent news...")
    async for msg in research_agent.receive_response():
        ...
```

The second `query()` here **does** have full context from the first.

### `ClaudeAgentOptions` fields you must recognise

| Field | Purpose | Example |
|---|---|---|
| `model` | Claude model id | `"claude-opus-4-6"` |
| `allowed_tools` | Tools Claude can use **without approval** | `["WebSearch", "Read"]` |
| `disallowed_tools` | Tools removed **entirely from context** | `["WriteFile"]` |
| `system_prompt` | Specialised behaviour (e.g., citation format) | `RESEARCH_SYSTEM_PROMPT` |
| `max_buffer_size` | Message buffer size in **bytes** | `10 * 1024 * 1024` (10 MB) |
| `cwd` | Working directory for file ops | `"research_agent"` |

### Tool permission tiers (exam likely asks this directly)

1. **`allowed_tools`** — Claude uses **freely, no approval gate**.
2. **Other tools** — Available but **require approval** before each use.
3. **Read-only tools** — Allowed by default.
4. **`disallowed_tools`** — **Removed entirely** from Claude's context (Claude does not even see them).

### The buffer-size anti-pattern (named explicitly in the cookbook)

**Error you'll see if you ignore it:**

```
Fatal error in message reader: Failed to decode JSON:
JSON message exceeded maximum buffer size of 1048576 bytes
```

**Why it happens:**
- Default `max_buffer_size` is **1 MB (1,048,576 bytes)**
- Images are **base64-encoded** in messages → size inflates ~33%
- A 200 KB PNG becomes **~270 KB+ encoded**, then JSON-framed
- Multiple image turns accumulate → fails fast

**Fix:**

```python
ClaudeAgentOptions(
    allowed_tools=["WebSearch", "Read"],
    max_buffer_size=10 * 1024 * 1024,  # 10 MB for multimodal
)
```

**Best practices for buffer sizing:**
- 10 MB for typical multimodal work
- Higher for large document processing
- Consider whether you really need full images — descriptions or thumbnails may suffice
- Monitor for buffer errors and adjust

### Citation-quality anti-pattern → fix with `system_prompt`

Without a system prompt instructing citation format, research agents may produce unverifiable claims. Fix:

```python
RESEARCH_SYSTEM_PROMPT = """You are a research agent specialized in AI.
When providing research findings:
- Always include source URLs as citations
- Format citations as markdown links: [Source Title](URL)
- Group sources in a "Sources:" section at the end of your response"""
```

### Tool-allowlist best practices

**Three-tool research pattern:**

```python
allowed_tools=["WebSearch", "Read", "Glob"]
```

- `WebSearch` — autonomous web research
- `Read` — image/PDF/document analysis (multimodal)
- `Glob` — list files in working directory for context discovery

**Explicit restriction:**

```python
disallowed_tools=["WriteFile"]
```

Use when you want to prevent dangerous operations while still allowing everything else.

### Production wrapper pattern

The cookbook demonstrates encapsulating `ClaudeSDKClient` behind a helper:

```python
from research_agent.agent import send_query

result1 = await send_query("What is Anthropic?")
result2 = await send_query(
    "What are their products?",
    continue_conversation=True,  # opt-in stateful follow-up
)
```

**Why this matters for the exam:** the *interface* (single function with a `continue_conversation` flag) hides the stateless/stateful choice from callers — recognise this as the "abstract complexity" production pattern.

### Quick decision table (likely test-bank format)

| Concept | API surface | Use when |
|---|---|---|
| Stateless query | `query()` | Independent / parallel research; fresh context each time |
| Stateful agent | `ClaudeSDKClient` + `async with` | Multi-turn, iterative, context-dependent |
| Tool autonomy | `allowed_tools` | Avoid approval gates for safe tools |
| Tool prohibition | `disallowed_tools` | Strip tool from Claude's view entirely |
| Multimodal | `Read` + `max_buffer_size=10MB` | Image/PDF analysis |
| Citation control | `system_prompt` | Force verifiable citation format |
| Working dir | `cwd` | Scope file ops to a sub-directory |

---

## Exam-day recall hooks

1. **Multi-agent works "mainly because they help spend enough tokens to solve the problem"** — token count is 80% of the variance.
2. **4×** chat-vs-agent multiplier; **15×** chat-vs-multi-agent multiplier — pick answers that respect economics.
3. **Orchestrator + parallel subagents** is the canonical multi-agent answer. **Structured per-agent reports** is the canonical state-persistence answer.
4. **Rainbow deployment** = gradual traffic shift, both versions live simultaneously. Used because agents are stateful long-runners.
5. **Resume from checkpoint > restart from beginning** for long-running agents. Combine adaptive (LLM) + deterministic (retry/checkpoint) recovery.
6. **5-criterion LLM-as-judge rubric**: factual accuracy, citation accuracy, completeness, source quality, tool efficiency. **Single judge, one call, 0.0–1.0 + pass/fail** beats per-criterion judges.
7. **20 queries is enough** for early agent evals — don't wait for big datasets.
8. **Default `max_buffer_size` is 1 MB. Bump to 10 MB for multimodal.** Base64 expansion ~33%.
9. **`allowed_tools` ≠ `disallowed_tools`**: allowed = free use; disallowed = removed from context. "Other" tools are gated by approval.
10. **`query()` = stateless**, **`ClaudeSDKClient` = stateful within `async with`**. The cookbook's `send_query(continue_conversation=True)` wrapper hides this.
