# Anthropic Foundry

**A consolidated, machine-readable prep corpus for the Claude Certified Architect – Foundations (CCAR-F) exam.**

Eight public sources went in. One normalised question bank came out: **211 scenario-based
questions**, every one with four options, a marked answer, and a written explanation —
mapped onto the five official exam domains and their weightings.

> **Naming note.** This project is filed under the working name *"Foundry"*. The exam
> Anthropic actually administers is the **Claude Certified Architect – *Foundations***
> (CCAR-F). Same exam, and everything here targets it.

---

## What's in the bank

| Domain | Topic | Official weight | Questions here |
|---|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27% | 54 |
| 2 | Tool Design & MCP Integration | 18% | 28 |
| 3 | Claude Code Configuration & Workflows | 20% | 49 |
| 4 | Prompt Engineering & Structured Output | 20% | 53 |
| 5 | Context Management & Reliability | 15% | 27 |
| | **Total** | **100%** | **211** |

The real exam is **60 scenario-based questions in 120 minutes**, scored **100–1,000**,
passing at **720** (~69%), delivered through Pearson VUE. This bank is roughly 3.5× the
length of one sitting, so it works as a drill set rather than a single mock.

---

## Layout

```
anthropic-foundry/
├── data/
│   ├── domains.json        # the 5 domains, weights, task statements, routing keywords
│   └── questions.json      # ← the deliverable: 211 normalised questions
├── scripts/
│   ├── parsers.mjs         # one parser per source format
│   └── build-bank.mjs      # merge + dedupe + domain-classify → data/questions.json
├── sources/                # every upstream source, archived verbatim with attribution
│   ├── olivier-alter/      # 77-question markdown exam + Claude Code skill
│   ├── hamza-farooq/       # interactive HTML exam + 5 domain cheat-sheets (MIT)
│   ├── dnacenta/           # full unofficial study guide, 5 domain deep-dives
│   ├── marco-cheng-gist/   # 72-block practice exam with worked reasoning
│   ├── k21academy/         # CCAR-F lab curriculum notes
│   ├── examheist/          # archival note (page is JS-gated — see below)
│   └── facebook-ccdv-f/    # notes on the adjacent CCDV-F developer cert
├── docs/
│   └── exam-blueprint.md   # the condensed "what they actually test" brief
└── SOURCES.md              # provenance + licence for every source
```

## Rebuild the bank

```bash
node scripts/build-bank.mjs
```

No dependencies — plain Node ESM. The script prints a per-source parse report:

```
olivier-alter          parsed=77 unique=77 dup=0
marco-cheng-gist       parsed=72 unique=72 dup=0
hamza-practice-exam    parsed=55 unique=53 dup=2
hamza-quick-quiz       parsed=10 unique=9  dup=1
TOTAL 211 questions -> data/questions.json
```

The parsers are strict on purpose: a block that doesn't yield exactly four options, a
valid answer index and an explanation is dropped and counted. If an upstream source
changes format, the count falls — it doesn't quietly poison the bank.

### Question schema

```jsonc
{
  "id": "Q001",
  "domainId": 1,
  "domainTitle": "Agentic Architecture & Orchestration",
  "domainWeight": 27,
  "task": "1.1 Design agentic loops for autonomous task execution",  // or null
  "scenario": "Customer Support Agent",                               // or null
  "question": "Production data shows that in 12% of cases…",
  "options": ["…", "…", "…", "…"],
  "correct": 0,                    // index into options
  "explanation": "When a specific tool sequence is required…",
  "source": "olivier-alter",
  "sourceRef": "Q1",
  "alsoIn": [{ "source": "hamza-practice-exam", "ref": "D1-1" }]
}
```

### How questions get a domain

Two sources tag their own domain; two don't. Untagged questions are classified by
weighted keyword match against `data/domains.json` (multi-word keywords count double).
It's a heuristic, not an oracle — `domainId` is for filtering and study balance, not a
claim about how Anthropic would categorise the item.

### How duplicates are handled

The community banks independently reworded the same official sample questions. Two
questions are treated as one only when the first 140 alphanumeric characters of the stem
match exactly. Reworded variants are kept as separate drill items — same idea, different
distractors, which is the useful part. When a true duplicate is found, the longest
explanation wins and the duplicate's origin is recorded in `alsoIn`.

---

## Live version

The bank is published as a browsable exam trainer at
**[codewithalok2026.vercel.app/foundry](https://codewithalok2026.vercel.app/foundry)** —
filter by domain, hide/reveal answers, or run a timed 60-question mock under real exam
rules.

---

## Honest limitations

- **Unofficial.** Nothing here is from Anthropic. It is a merge of community
  reverse-engineering of the published exam guide. Passing this does not mean passing that.
- **Answers are the upstream authors' opinions.** Most are well argued; a few are
  debatable. Read the explanation, not just the letter.
- **Domain counts don't match exam weights.** The bank over-represents Domains 1, 3 and 4
  because the sources did. Use the domain filter to balance your own practice.
- **ExamHeist could not be archived** — the page renders entirely client-side and returns
  no question content to a plain fetch. It is listed for completeness only.

## Licence

Original code and documentation in this repo: **MIT** (see `LICENSE`).
Everything under `sources/` belongs to its original author and retains its own licence —
see [SOURCES.md](SOURCES.md). Claude, Claude Code and the Claude Certified Architect
programme are products of [Anthropic](https://www.anthropic.com); this project is not
affiliated with or endorsed by them.
