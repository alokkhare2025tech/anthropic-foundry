# Claude Certified Associate - Foundations (CCAO-F): The Complete Study Guide

A full preparation guide for Anthropic's non-technical certification. Part I teaches the material by topic. Part II re-indexes it by exam domain for revision. Part III covers trap answers, worked questions, and a final checklist.

Maintained by [preporato.com](https://preporato.com). Facts verified against the official exam guide and program pages as of August 2026.

---

## Contents

- [Introduction](#introduction)
- [Exam format](#exam-format)
- **Part I: The material**
  - [Chapter 1: Evaluating outputs and catching hallucinations](#chapter-1-evaluating-outputs-and-catching-hallucinations)
  - [Chapter 2: Fitting Claude into business workflows](#chapter-2-fitting-claude-into-business-workflows)
  - [Chapter 3: Governance and responsible use](#chapter-3-governance-and-responsible-use)
  - [Chapter 4: Prompting for business tasks](#chapter-4-prompting-for-business-tasks)
  - [Chapter 5: Choosing models and features](#chapter-5-choosing-models-and-features)
  - [Chapter 6: Projects, knowledge, and connectors](#chapter-6-projects-knowledge-and-connectors)
  - [Chapter 7: Troubleshooting weak outputs](#chapter-7-troubleshooting-weak-outputs)
- **Part II: Exam domain notes**
  - [All seven domains](#part-ii-exam-domain-notes)
- **Part III: Exam preparation**
  - [The preparation ladder](#the-preparation-ladder)
  - [The six trap answers](#the-six-trap-answers)
  - [Exam-day strategy](#exam-day-strategy)
  - [Worked questions](#worked-questions)
  - [3-week study plan](#3-week-study-plan)
  - [Pre-exam checklist](#pre-exam-checklist)
  - [Resources](#resources)

---

## Introduction

CCAO-F (Claude Certified Associate - Foundations) is the one Claude certification requiring no code, no API knowledge, and no engineering background. It validates that a professional can use the claude.ai product (the web and desktop application, as opposed to the developer platform) effectively and responsibly for real business work: drafting, research, analysis, planning, and process improvement.

Do not mistake non-technical for easy. The single largest domain is **evaluating outputs**, and more than a third of the exam sits in judgment territory: catching hallucinations before they reach a client, knowing when a human must own the final call, and recognizing which data never belongs in a chat. Candidates who prepare only on features routinely get caught by exactly those questions.

**Who should take it:** professionals in operations, marketing, project management, education, communications, and analysis who use Claude regularly and want a credential proving it. Anthropic recommends regular hands-on professional use, structured problem-solving, and a practical grasp of AI limitations.

## Exam format

| | |
|---|---|
| Questions | 60, all scored |
| Duration | 120 minutes |
| Passing score | 720 on a 100-1000 scaled score |
| Question style | Single-answer plus multiple-response (~a quarter of items), **no partial credit** |
| Delivery | Pearson VUE, test center or online proctored |
| Price | $99 per attempt, the most accessible entry in the program |
| Registration | Anthropic Partner Academy (free Claude Partner Network membership); passing earns a Credly badge |
| Validity | 1 year; free non-proctored renewal before expiration, full proctored retake after a lapse |
| Scope | The claude.ai product only. Programming and API topics are deliberately excluded |

### Exam domains

| Domain | Weight | ~Questions | Core focus |
|--------|--------|-----------|------------|
| 1. Output Evaluation & Validation | 21% | ~13 | Hallucination spotting, fact-checking, human review |
| 2. Workflow Integration & Solution Design | 16% | ~10 | Where Claude fits in real business processes |
| 3. Governance, Risk & Responsible Use | 15% | ~9 | Data sensitivity, policy, appropriate use |
| 4. Prompting & Task Execution | 14% | ~8 | Business prompts, decomposition, iteration |
| 5. Product & Model Selection | 12% | ~7 | Model tiers; chat vs Projects vs research |
| 6. Configuration & Knowledge Management | 12% | ~7 | Project instructions, knowledge, connectors |
| 7. Troubleshooting & Optimization | 10% | ~6 | Diagnosing weak outputs, systematic fixes |

---

# Part I: The material

## Chapter 1: Evaluating outputs and catching hallucinations

The heaviest domain, and one habit underneath it: **every output is a draft that must earn trust before it leaves your screen.**

### 1.1 What a hallucination looks like

A hallucination is a confident, plausible statement that is factually wrong or unsupported by any source. The exam expects recognition from symptoms alone:

- **Highly specific numbers, dates, or statistics with no source.** Precision signals confidence and reveals nothing about accuracy.
- **Named studies, publications, or quotes you cannot locate.** Fabricated citations read exactly like real ones until checked.
- **Details beyond the material you provided.** If the summary of last quarter's report mentions figures the report never contains, Claude filled the gap itself.
- **Uniform confidence across every claim.** The weakest guesses arrive in the same fluent tone as established facts, so tone can never substitute for verification.
- **Answers about events after the model's knowledge cutoff** with no research mode or attached source grounding them.

A worked example, in the form the exam uses. You attached this excerpt from a quarterly report:

> Q2 revenue was $4.2M, up from Q1. The Enterprise segment led growth. We closed 14 new enterprise accounts during the quarter.

Claude's summary reads:

> Revenue grew 18% quarter-over-quarter to $4.2M, driven by the Enterprise segment, which closed 14 new accounts including two Fortune 500 logos. According to a Gartner study, this growth rate places the company in the top decile of its peer group.

Three hallucinations, each matching a red flag: **"18%"** is a specific figure the source never states (the source says only "up from Q1"), **"two Fortune 500 logos"** goes beyond the provided material, and **the Gartner study** is a citation you will not locate. The revenue figure, the segment, and the account count are grounded. The tone is identical across all six claims, which is exactly why tone cannot be the filter.

### 1.2 The validation sequence

For any output that carries consequences: verify every name, number, date, and quotation against the original source. Ask Claude directly which part of the attached document supports a specific claim; a grounded answer can point to its evidence, and a hallucinated one cannot. Cross-check external facts in an independent reference before repeating them. And watch for bias as well as error: one-sided analysis, stereotyped examples, and missing counterarguments all count as evaluation failures.

### 1.3 When human review is mandatory

Anything external-facing (client emails, published copy, press materials), anything with legal, financial, or health consequences, anything feeding a decision about people (hiring, performance, vendor selection), and anything in a regulated workflow. The exam rewards keeping a person accountable at those points regardless of how good the output looks.

### 1.4 Choosing an output format

Inline chat response for quick answers and short summaries. An **Artifact** (a separate panel holding a standalone deliverable) for anything you will revise and share. A structured format (table, bulleted list) for output feeding another step, because structure makes checking easier.

## Chapter 2: Fitting Claude into business workflows

Design questions start from the task: state the deliverable, the audience, the source material, and what success looks like before opening a chat. Jumping straight to prompting without defining the task is wrong at this level.

| Strong fit | Weak fit |
|-----------|----------|
| First drafts of emails, briefs, reports, plans | Final authority on factual accuracy |
| Summarizing meetings, long documents, research | Decisions requiring human accountability (hiring, legal, spend) |
| Reformatting and repurposing content across channels | Precise high-volume calculations a spreadsheet should own |
| Brainstorming options, angles, counterarguments | Current events and live data, unless research mode grounds them |

Three principles carry the domain:

- **Keep the person at the judgment step.** Claude produces drafts and analysis; a human makes the decision and signs off on facts.
- **Communicate value and limits together.** Presenting Claude to stakeholders pairs a concrete outcome ("hours saved weekly on meeting summaries") with an honest limitation ("outputs are probabilistic and require review").
- **Pilot before rollout.** One workflow, measured before and after, then expand. Big-bang adoption answers lose to measured pilots.

## Chapter 3: Governance and responsible use

One habit: **check the policy before you paste.** When unsure whether data is sensitive, treat it as sensitive.

| Area | Do | Don't |
|------|----|----|
| Data sensitivity | Check your organization's AI policy before sharing internal data | Paste customer records, financials, or trade secrets for convenience |
| Personal data | Anonymize or summarize before sharing when the task allows | Include names, contacts, or health information you do not need |
| Appropriate use | Draft, summarize, analyze, brainstorm | Let Claude be sole decision-maker on hiring, legal, or medical questions |
| Regulated content | Route legal/financial/compliance outputs through qualified reviewers | Publish regulated advice on the strength of a fluent answer |
| Transparency | Follow your organization's AI-disclosure rules | Present AI-generated work as independently verified when it is not |
| Policy conflicts | Escalate ambiguous use cases to the policy owner | Assume approval because a tool is available |

Two decision rules cover most scenarios: if an output affects people's **rights, money, health, or legal standing**, a qualified human owns the final call. If data would cause harm were it **leaked**, the policy check comes before any productivity benefit.

## Chapter 4: Prompting for business tasks

### 4.1 The five-part business prompt

Role or context ("You are helping a project manager prepare a stakeholder update"), the task, the source material, the constraints (audience, length, tone), and the output format. "Summarize these meeting notes for the executive team in five bullet points, each naming an owner and a deadline" beats "summarize this" on every axis the exam measures.

Before and after, on the same task:

> **Weak:** "Summarize these meeting notes."

> **Strong:** "You are helping a project manager prepare a stakeholder update. Summarize the attached meeting notes for the executive team in five bullet points. Each bullet names the decision made, the owner, and the deadline. Formal tone, no jargon, nothing that was only discussed without a decision."

The strong version carries all five parts: role, task, source, constraints, format. Every improvement in the output is traceable to one of those five additions, which is how the exam expects you to diagnose weak prompts in reverse.

### 4.2 Task decomposition

Split a large deliverable into a sequence of smaller prompts, each producing something checkable before moving on. A quarterly report becomes: agree on an outline, draft one section at a time from its source material, then a final pass for tone and consistency. Decomposition is the tested answer whenever a scenario involves a multi-part deliverable, a long document, or a shallow result from one giant prompt.

### 4.3 Iteration

The first response is a starting point. Steer with specific feedback: "cut this to half the length, make the tone more direct, keep the three statistics" gives Claude something to act on. Regenerating and hoping does not, and the exam consistently rewards targeted refinement over rerolls.

### 4.4 Prompt strategy by task type

| Task type | Adjust the prompt to |
|-----------|---------------------|
| Analysis | Provide sources, name the criteria to weigh, ask for reasoning before conclusions |
| Research | Use research mode, require checkable sources |
| Drafting | Specify audience, tone, length, format; share an example of good |
| Brainstorming | Ask for volume and variety first, evaluate and narrow second |

## Chapter 5: Choosing models and features

### 5.1 Model selection

| Model | Optimizes for | Pick it for |
|-------|--------------|-------------|
| Haiku | Speed and low cost | Quick, well-defined tasks at volume: reformatting, short summaries, first-pass triage |
| Sonnet | Balance of quality, speed, cost | The everyday default: drafting, analyzing reports, synthesizing notes |
| Opus | Deepest reasoning, highest quality | Complex high-stakes work: multi-document strategy, plans where an error is expensive |

Default to Sonnet and move on evidence: up to Opus when the task genuinely demands deeper reasoning, down to Haiku when the task is simple and speed beats polish. The most powerful model for every task is a recurring wrong answer.

### 5.2 Feature selection

| Feature | What it is | Reach for it when |
|---------|-----------|-------------------|
| Chat | A single standalone conversation | One-off question or quick draft, no saved setup |
| Projects | A workspace with standing instructions and uploaded knowledge shared across its chats | The same context, documents, or standards recur across sessions |
| Research mode | Claude searches current sources and cites findings | You need up-to-date, verifiable information |
| Artifacts | A side panel holding a standalone, editable deliverable | Producing a document or table to refine over rounds and share |

### 5.3 Context limits and the three moves

The context window is the amount of conversation and attached material Claude can consider at once, and long sessions strain it. Three moves cover the exam's scenarios: **restart** a fresh chat when a long conversation drifts or ignores instructions; **summarize** the decisions so far and carry the summary into the new chat; **persist** durable reference material into Project knowledge so no single conversation holds it.

## Chapter 6: Projects, knowledge, and connectors

A Project has two configurable layers, and the classic exam question is knowing which layer a piece of setup belongs in:

- **Project instructions**: standing directions applied to every chat in the workspace (role, tone standards, required formats).
- **Project knowledge**: uploaded documents (style guides, product sheets, past reports) Claude draws on in every conversation.

| You want to... | Put it in |
|----------------|-----------|
| Apply a tone, role, or format standard to every chat | Project instructions |
| Make reference documents available to every chat | Project knowledge |
| Give details that matter only for today's task | The individual chat prompt |
| Pull from email or files that change frequently | A connector (Gmail, Google Drive) |

What good Project instructions look like, for a marketing team's content workspace:

> You are a content editor for Meridian Software's marketing team. In every chat:
> - Follow the brand voice guide in Project knowledge; flag any request that conflicts with it
> - Audience is IT decision-makers; avoid consumer-marketing tone
> - All statistics must come from the attached fact sheet; if a claim is not there, say so instead of estimating
> - Default deliverable format: headline options first, then body copy, then a three-line summary for approvals

Standing role, standards, a guardrail against invented statistics, and a default format. The documents those instructions reference (the voice guide, the fact sheet) live in Project knowledge; today's campaign brief goes in the individual chat.

**Connectors** link Claude to live sources with your permission; reach for one when material lives in those tools and changes often enough that a static upload would go stale. Configuration needs maintenance: revisit instructions when outputs drift from standards, and update or remove knowledge files when the underlying documents change, because stale knowledge produces confidently outdated answers.

## Chapter 7: Troubleshooting weak outputs

The exam gives a symptom and asks for the most effective fix:

| Symptom | Likely cause | First fix |
|---------|-------------|-----------|
| Generic output that could apply to any company | Prompt lacks context and constraints | Add role, audience, sources, and an example of good |
| Instructions ignored late in a long chat | Context overload and drift | Restart with a summary; move standing rules into Project instructions |
| Confident but wrong claims about your business | No source material provided | Attach documents or connect the source, ask Claude to cite them |
| Wrong format every time | Format described vaguely | Show a concrete example of the structure |
| Quality varies across teammates on the same task | No shared setup | A shared Project with instructions and knowledge |
| Half of a multi-part request ignored | Too many asks in one prompt | Decompose and run steps in sequence |

The optimization rule tying the domain together: **change one variable at a time.** Adjust the prompt, or the model, or the knowledge, compare, then change the next thing. Changing several at once tells you nothing about what worked.

---

# Part II: Exam domain notes

## Domain 1: Output Evaluation & Validation (21%)

**Know:** the five hallucination red flags; the validation sequence; the mandatory-human-review list; which output format fits which use.

**Be able to:** spot a fabricated citation or ungrounded figure from symptoms; ask Claude to point at its supporting evidence; name the review gate a scenario requires.

**Anti-patterns:** trusting fluency; skipping verification because the output "looks right"; treating tone as a signal of accuracy.

## Domain 2: Workflow Integration & Solution Design (16%)

**Know:** the strong-fit/weak-fit table; the human-at-the-judgment-step division; value-plus-limits stakeholder framing; pilot-then-expand.

**Be able to:** define deliverable, audience, sources, and success before prompting; place Claude at the draft stage of a real process.

**Anti-patterns:** Claude as final factual authority; big-bang rollouts; benefits pitched without limits.

## Domain 3: Governance, Risk & Responsible Use (15%)

**Know:** the do/don't matrix; the two decision rules (rights/money/health/legal → human owns the call; leak-harmful data → policy before productivity).

**Be able to:** classify data sensitivity conservatively; escalate ambiguous cases to the policy owner; route regulated outputs through qualified reviewers.

**Anti-patterns:** paste-first; sole-decision-maker Claude; presenting AI work as independently verified.

## Domain 4: Prompting & Task Execution (14%)

**Know:** the five-part prompt; decomposition triggers; iteration with targeted feedback; the per-task-type adjustments.

**Be able to:** rewrite "summarize this" into a complete prompt; sequence a large deliverable into checkable steps.

**Anti-patterns:** one-giant-prompt; regenerate-and-hope.

## Domain 5: Product & Model Selection (12%)

**Know:** the three model rules and the Sonnet default; the four feature triggers; the three context moves (restart, summarize, persist).

**Be able to:** match a business task to a model on speed/cost/quality; pick chat vs Project vs research mode vs Artifact from scenario wording.

**Anti-patterns:** strongest-model-everywhere; rebuilding context by hand every session.

## Domain 6: Configuration & Knowledge Management (12%)

**Know:** instructions vs knowledge vs chat prompt vs connector; connector triggers; configuration maintenance.

**Be able to:** place any setup detail in its correct layer; recognize stale knowledge as a cause of confidently outdated answers.

**Anti-patterns:** standing rules retyped per chat; static uploads of fast-changing sources.

## Domain 7: Troubleshooting & Optimization (10%)

**Know:** all six symptom-cause-fix rows; one-variable-at-a-time.

**Be able to:** pick the first fix from the symptom, and diagnose before changing anything.

**Anti-patterns:** multi-variable changes; fixing generic output by regenerating.

---

# Part III: Exam preparation

## The preparation ladder

Four layers, in order. Each builds on the previous, and the free layers take you surprisingly far.

| Step | Resource | Cost |
|------|----------|------|
| 1. Learn the vocabulary | [Anthropic Partner Academy courses](https://claude.com/partners), the official exam guide, and the [Anthropic Academy courses](https://www.anthropic.com/learn) mapped in Resources | Free |
| 2. Go to the source | The claude.ai Help Center, the primary source for this exam | Free |
| 3. First calibration | [20 free CCAO-F practice questions](https://preporato.com/free/claude-certified-associate-foundations/questions?utm_source=github&utm_medium=guide&utm_campaign=ccao-f) in the real exam format | Free |
| 4. Full calibration | [Six full-length 60-question practice tests and a 500-card flashcard deck](https://preporato.com/certificates/claude-certified-associate-foundations?utm_source=github&utm_medium=guide&utm_campaign=ccao-f) built on the exact domain weights | Paid |

Steps 1-3 cost nothing and tell you honestly where you stand. Step 4 is how you close the gap they reveal.

## The six trap answers

| Trap | Why it fails |
|------|-------------|
| Trust-the-output | Fluency is not verification; consequential output gets validated |
| Strongest-model-everywhere | Ignores speed and cost; choice matches complexity and stakes |
| One-giant-prompt | Multi-part deliverables get decomposed into checkable steps |
| Paste-first | The policy check precedes the productivity win |
| Regenerate-and-hope | Targeted feedback beats rerolls |
| Rebuild-every-session | Recurring context belongs in a Project |

On multiple-response items, apply the traps per option: one paste-first or trust-the-output pick among your selections costs the whole question, because there is no partial credit.

## Exam-day strategy

120 minutes for 60 questions is two minutes each, and CCAO-F stems are short, so time pressure is mild. The risk is pattern-matching on features when the question is really about judgment: before answering, ask which domain this is, and if the scenario involves facts, people, or sensitive data, expect the answer to include a safeguard. Flag long deliberations, return at the end, change answers only on certain error.

## Worked questions

Ten fresh questions in the exam's style. (Written for this guide; timed full-length practice is linked in Resources.)

**Q1.** Claude summarizes your attached quarterly report and includes a revenue growth percentage. The report contains no such percentage. What happened, and what is the correct response?

- A) Claude calculated it from the report's figures; include it
- B) A hallucination filled a gap in the source; remove or verify the figure against the original before the summary goes anywhere
- C) The model used more recent data; keep the number
- D) A formatting error; regenerate the summary

**Answer: B.** Details beyond the provided material are a named red flag. A assumes a calculation nobody verified, C invents a data source chat Claude does not have, and D rerolls without addressing the accuracy problem.

**Q2.** A manager wants Claude to rank the team's five sales reps for a promotion decision, using performance notes. The correct guidance?

- A) Fine, if the notes are anonymized first
- B) Fine, if Opus is used for deeper reasoning
- C) Claude can summarize and organize the notes, but a decision about people requires the manager to own the judgment and the final call
- D) Refuse to use Claude anywhere near performance data

**Answer: C.** Decisions about people (hiring, performance) sit on the mandatory-human-judgment list. A solves a privacy slice of the problem and misses the accountability core, B upgrades the model without changing who decides, and D overcorrects past the do-column uses that remain fine.

**Q3.** A colleague pastes a customer list with emails and contract values into a chat "to save time formatting it." What should have happened first?

- A) Switching to a more capable model for accuracy
- B) Checking the organization's AI data policy, and anonymizing or summarizing the sensitive fields if the task allows
- C) Turning on research mode for verification
- D) Nothing; formatting is a low-risk task

**Answer: B.** Paste-first is the trap: leak-harmful data (customer records, financials) triggers the policy check before any convenience. The task being "just formatting" changes nothing about what was shared.

**Q4.** Your prompt "write a blog post about our new product" returned something generic enough to describe any company's product. The most effective fix?

- A) Regenerate until a better version appears
- B) Switch to the most capable model
- C) Rewrite the prompt with role, audience, tone, length, the product sheet attached, and an example post you like
- D) Split the request across three chats

**Answer: C.** Generic output means the prompt lacked context and constraints; the five-part prompt is the fix. A is regenerate-and-hope, B is strongest-model-everywhere, and D decomposes without adding the missing context.

**Q5.** Every week you produce the same client status update: same tone rules, same format, drawing on the same background documents. Today you retype the instructions and re-upload the files. The better setup?

- A) A Project with the tone and format in instructions and the background documents in knowledge, so every chat starts configured
- B) A saved text file of prompts to paste each time
- C) One very long chat reused forever
- D) Research mode, which remembers sources

**Answer: A.** Recurring context is the Projects trigger, and the instructions/knowledge split matches standing rules vs reference material. B still rebuilds by hand, C walks into context drift, and D misdescribes research mode.

**Q6. (Select TWO)** Which two situations make human review mandatory rather than optional?

- A) A draft agenda for an internal team meeting
- B) A response to a customer complaint about billing, sent under the company's name
- C) A brainstorm of taglines for an internal workshop
- D) A summary feeding a decision on which vendor contract to terminate
- E) A reformatted version of your own notes

**Answer: B and D.** External-facing communication with financial context (B) and input to a consequential decision about money and vendors (D) both sit on the mandatory-review list. A, C, and E are low-stakes internal drafts.

**Q7.** Twenty exchanges into a long chat, Claude starts ignoring the formatting rules you set at the beginning. Best response?

- A) Repeat the rules more forcefully in the next message
- B) Restart a fresh chat carrying a summary of decisions so far, and move the standing rules into Project instructions so they persist
- C) Switch to a faster model
- D) Ask Claude why it is ignoring you

**Answer: B.** Late-chat instruction loss is context drift; the restart-summarize-persist trio is the fix, and instructions belong in the layer that survives across chats. A treats a structural problem as an emphasis problem, and C changes speed rather than context.

**Q8.** You need current pricing for three competitors, announced within the last month, for a comparison table you will present. Which approach fits?

- A) Ask Claude directly and trust its training knowledge
- B) Use research mode so Claude searches current sources with citations, then verify the cited pages before presenting
- C) Use Opus, whose knowledge is more recent
- D) Ask three times and keep the consistent answers

**Answer: B.** Recent, verifiable information is the research mode trigger, and the citations still get checked before an external-facing deliverable. A and C rely on training data for post-cutoff facts (model capability does not change the cutoff), and D mistakes consistency for accuracy.

**Q9.** Your team's five analysts produce weekly client reports with Claude, and quality varies wildly: different tones, different structures, statistics of unclear origin. Which single change addresses all three symptoms?

- A) Have the strongest analyst review everyone's output before it ships
- B) A shared Project: tone and structure standards in the instructions, the approved data sources in knowledge, used by all five analysts
- C) Standardize on the most capable model
- D) A shared document of prompt examples analysts can copy from

**Answer: B.** Variance across teammates on the same task is the no-shared-setup symptom, and a shared Project fixes tone (instructions), structure (instructions), and data provenance (knowledge) in one move. A adds a bottleneck without fixing the source, C changes quality but not consistency, and D depends on five people copying correctly forever.

**Q10.** A colleague asks Claude for your company's Q3 market share, gets "23.4%, per IDC's industry tracker," and pastes it into a board slide. No source was attached to the chat. What should have happened?

- A) Nothing; the citation makes it credible
- B) Ask Claude to double-check its own number in the same chat
- C) Treat it as unverified: a specific figure with a named study and no attached source is the hallucination profile, so verify against the actual IDC data (or use research mode with checkable citations) before it reaches the board
- D) Rephrase the question and compare the two answers

**Answer: C.** Specific number, named study, no grounding: two red flags at once, headed for an external-facing, high-stakes surface, which also makes human verification mandatory. A trusts the tell that most needs checking, B asks the same ungrounded process to grade itself, and D mistakes consistency for accuracy.

## 3-week study plan

- **Week 1: official baseline.** Join the [Claude Partner Network](https://claude.com/partners) (free), complete the Partner Academy associate courses, read the exam guide, and map yourself against the seven domains.
- **Week 2: deliberate product practice.** Work through the claude.ai Help Center systematically, and use every feature the blueprint names on your own real work: build a Project with instructions and knowledge, produce Artifacts, run research mode, connect a live source, and compare the three models on one task. Practice the judgment side deliberately: run the validation sequence on a real output, and apply the governance matrix to your own team's data.
- **Week 3: calibrate.** Start with the [20 free questions](https://preporato.com/free/claude-certified-associate-foundations/questions?utm_source=github&utm_medium=guide&utm_campaign=ccao-f) to see the format, then take [full-length timed practice tests](https://preporato.com/certificates/claude-certified-associate-foundations?utm_source=github&utm_medium=guide&utm_campaign=ccao-f), with per-domain review and a final pass on the two judgment domains (evaluation and governance), which catch feature-focused candidates. The night before: Part III here plus the [cheat sheet](https://preporato.com/blog/claude-certified-associate-foundations-cheat-sheet-2026).

Expanded version: [3-week CCAO-F study plan](https://preporato.com/blog/ccao-f-study-plan-3-week-preparation-2026).

## Pre-exam checklist

- [ ] I can name five hallucination red flags and what each signals
- [ ] I can run the validation sequence and say when human review is mandatory
- [ ] I know which output format fits a quick answer, a shared deliverable, and a downstream process
- [ ] I can name Claude's strong fits and weak fits in a business workflow
- [ ] I can present Claude to stakeholders with a concrete benefit and an honest limitation
- [ ] I can apply the governance do/don't matrix to a data-sensitivity scenario
- [ ] I know the two governance decision rules (rights/money/health/legal; leak-harm)
- [ ] I can write a five-part business prompt
- [ ] I can decompose a large deliverable into checkable steps and iterate with specific feedback
- [ ] I can choose Haiku, Sonnet, or Opus from speed, cost, and quality needs
- [ ] I can pick chat, Project, research mode, or Artifact from a scenario trigger
- [ ] I know when to restart, summarize, or persist as a chat grows long
- [ ] I can place any setup detail into instructions, knowledge, a prompt, or a connector
- [ ] I can match all six troubleshooting symptoms to their first fix
- [ ] I change one variable at a time when improving a workflow
- [ ] I have the six traps down cold and apply them per option on multiple-response items
- [ ] I have taken at least two full-length timed practice tests and reviewed every miss

## Resources

**Official (free):**
- [Anthropic Partner Academy](https://claude.com/partners): the exam guide, prep courses, and registration
- claude.ai Help Center: the primary source for this exam
- Anthropic Academy courses, mapped to this exam's domains:
  - [Claude 101](https://anthropic.skilljar.com/claude-101): the product tour this exam assumes
  - [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations): delegation, description, discernment, and diligence; a direct match for the output evaluation and governance domains, with a certificate of completion
  - [AI Capabilities and Limitations](https://anthropic.skilljar.com/ai-capabilities-and-limitations): the judgment layer behind hallucination spotting and appropriate use
  - Audience variants exist too ([small businesses](https://anthropic.skilljar.com/ai-fluency-for-small-businesses), [educators](https://anthropic.skilljar.com/ai-fluency-for-educators), [students](https://anthropic.skilljar.com/ai-fluency-for-students)) if one matches your role

**Free articles (preporato.com):**
- [CCAO-F complete guide](https://preporato.com/blog/claude-certified-associate-foundations-complete-guide-2026) · [Cheat sheet](https://preporato.com/blog/claude-certified-associate-foundations-cheat-sheet-2026) · [Domains breakdown](https://preporato.com/blog/ccao-f-exam-domains-complete-breakdown-2026) · [How to pass first attempt](https://preporato.com/blog/how-to-pass-ccao-f-first-attempt-2026) · [CCAO-F vs CCDV-F](https://preporato.com/blog/ccao-f-vs-ccdv-f-which-claude-certification-2026)

**Practice ([preporato.com/certificates/claude-certified-associate-foundations](https://preporato.com/certificates/claude-certified-associate-foundations)):**
- [20 free practice questions](https://preporato.com/free/claude-certified-associate-foundations/questions?utm_source=github&utm_medium=guide&utm_campaign=ccao-f) in the real exam format
- (Paid) [Six full-length 60-question practice tests and a 500-card flashcard deck](https://preporato.com/certificates/claude-certified-associate-foundations?utm_source=github&utm_medium=guide&utm_campaign=ccao-f) built on the exact domain weights

---

*Not affiliated with Anthropic. Exam details reflect the program as of August 2026; the Partner Academy is authoritative. Found an error? [Open an issue](https://github.com/preporato/claude-certification-guide/issues).*
