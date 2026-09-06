# Anthropic Foundry

**A consolidated, machine-readable prep corpus for the Claude Certified Architect – Foundations (CCAR-F) exam.**

Nineteen public sources went in. One normalised question bank came out: **1,124 scenario-based
questions**, every one with four options, a marked answer, and a written explanation — with
**285 of them also explaining why each *wrong* answer is wrong**. All mapped onto the five
official exam domains and their weightings.

> **Naming note.** This project is filed under the working name *"Foundry"*. The exam
> Anthropic actually administers is the **Claude Certified Architect – *Foundations***
> (CCAR-F, also written CCA-F). Same exam, and everything here targets it.

---

## What's in the bank

| Domain | Topic | Official weight | Questions here |
|---|---|---|---|
| 1 | Agentic Architecture & Orchestration | 27% | 243 |
| 2 | Tool Design & MCP Integration | 18% | 205 |
| 3 | Claude Code Configuration & Workflows | 20% | 249 |
| 4 | Prompt Engineering & Structured Output | 20% | 247 |
| 5 | Context Management & Reliability | 15% | 180 |
| | **Total** | **100%** | **1,124** |

The real exam is **60 scenario-based questions in 120 minutes**, scored **100–1,000**,
passing at **720** (~69%), delivered through Pearson VUE for $125 USD, credential valid 12
months. This bank is roughly **19× the length of one sitting**, so it is dealt into
**12 study sets of 100** — each set keeps the blueprint's domain mix, so any single set is
a balanced session.

Also in the bank: **6 multiple-response items** ("select 2"), matching the real exam's
mixed format.

---

## Layout

```
anthropic-foundry/
├── data/
│   ├── domains.json        # the 5 domains, weights, task statements, routing keywords
│   └── questions.json      # ← the deliverable: 1,124 normalised questions
├── scripts/
│   ├── parsers.mjs         # wave 1 — 4 sources, 3 formats
│   ├── parsers2.mjs        # wave 2 — 8 sources, 5 more formats
│   └── build-bank.mjs      # merge + dedupe + classify + deal into sets
├── sources/                # every upstream source, archived verbatim with attribution
└── SOURCES.md              # provenance + licence for all nineteen
```

## Rebuild the bank

```bash
node scripts/build-bank.mjs
```

No dependencies — plain Node ESM. It prints a per-source parse report:

```
utkarsh-mocks          parsed=342 unique=341 dup=1
architects-ascent      parsed=192 unique=192 dup=0
cca-f-dojo             parsed=168 unique=168 dup=0
amey-thakur            parsed=80  unique=80  dup=0
olivier-alter          parsed=77  unique=77  dup=0
marco-cheng-gist       parsed=72  unique=72  dup=0
mominurr-mock          parsed=60  unique=60  dup=0
hamza-practice-exam    parsed=55  unique=53  dup=2
olgun-generated        parsed=110 unique=52  dup=58
shourabh-simulator     parsed=20  unique=20  dup=0
hamza-quick-quiz       parsed=10  unique=9   dup=1
tim-warner             parsed=60  unique=0   dup=60
TOTAL 1124 questions -> data/questions.json
```

The parsers are strict on purpose: a block that doesn't yield exactly four options, a
valid answer index and an explanation is dropped and counted. If an upstream source
changes format, the count falls — it doesn't quietly poison the bank. Current drop
count across all twelve parsers: **0**.

### Question schema

```jsonc
{
  "id": "Q0001",
  "setId": 1, "setIndex": 1,      // study set this question was dealt into
  "domainId": 1,
  "domainTitle": "Agentic Architecture & Orchestration",
  "domainWeight": 27,
  "task": "1.1 Design agentic loops for autonomous task execution",  // or null
  "scenario": "Customer Support Agent",                               // or null
  "question": "Production data shows that in 12% of cases…",
  "options": ["…", "…", "…", "…"],
  "correct": 0,                    // index — or an array of indices when multi
  "multi": false,                  // true for "select N" items
  "difficulty": 2,                 // 1–3 where the source provided it
  "explanation": "When a specific tool sequence is required…",
  "whyWrong": { "1": "…", "2": "…", "3": "…" },   // per-distractor, or null
  "source": "olivier-alter",
  "sourceRef": "Q1",
  "alsoIn": [{ "source": "hamza-practice-exam", "ref": "D1-1" }]
}
```

### How questions get a domain

Seven sources tag their own domain; five don't. Untagged questions are classified by
weighted keyword match against `data/domains.json` (multi-word keywords count double).
It's a heuristic, not an oracle — `domainId` is for filtering and study balance, not a
claim about how Anthropic would categorise the item.

### How duplicates are handled

Two questions are treated as one only when the first 140 alphanumeric characters of the
stem match exactly. Reworded variants are kept as separate drill items — same idea,
different distractors, which is the useful part. When a true duplicate is found the
longest explanation wins, the richest `whyWrong` wins, and the duplicate's origin is
recorded in `alsoIn`.

Two results worth reading: **tim-warner deduped to zero** — its 60 questions and the
mc-marcocheng gist both descend from Paul Larionov's now-deleted study repo, which the
merge detected independently. And **olgun-generated lost 58 of 110**, because its four
generated exams deliberately reuse items across sets.

### A parser bug worth knowing about

These repos are cloned on Windows, so git checks them out CRLF. In a JavaScript regex
`.` does not match `\r` — it's a line terminator — so every pattern ending `(.+)$`
silently matched **nothing** on a CRLF line. Three parsers returned zero rows before
`readText()` in `parsers2.mjs` normalised line endings at read time. If you add a parser,
read through that helper.

---

## Live version

The bank is published as a browsable trainer at
**[codewithalok2026.vercel.app/foundry](https://codewithalok2026.vercel.app/foundry)**:

- **[/foundry/cheatsheet](https://codewithalok2026.vercel.app/foundry/cheatsheet)** — the whole exam compressed onto one printable page.
- **[/foundry/study](https://codewithalok2026.vercel.app/foundry/study)** — all 1,124, by set, with domain/source filters and full-text search.
- **[/foundry/mock](https://codewithalok2026.vercel.app/foundry/mock)** — 60 questions in 120 minutes, domain-weighted, scored on the real scale.

---

## Honest limitations

- **This is not "every possible question."** No such set exists publicly — Anthropic does
  not publish the live item pool, and the real exam draws 4 scenarios at random from 6.
  What this is: every openly-licensed community bank I could find, merged and deduped.
- **Unofficial.** Nothing here is from Anthropic. Passing this does not mean passing that.
- **Answers are the upstream authors' opinions.** Most are well argued; a few are
  debatable. Where two sources disagree, read both explanations rather than trusting the
  letter. Several sources are explicit that their items are *generated from the public
  blueprint*, not recalled from a real sitting — which is the right way round.
- **Domain counts don't match exam weights**, because the sources over-cover Domains 1, 3
  and 4. Every domain now has 180+ questions, so use the domain filter to balance.
- **Two commercial sources contributed nothing.** ExamHeist renders entirely client-side
  and returns no question content to a plain fetch; it and several other paid banks were
  left alone rather than scraped.

## Licence

Original code and documentation in this repo: **MIT** (see `LICENSE`).
Everything under `sources/` belongs to its original author and retains its own licence —
see [SOURCES.md](SOURCES.md). Eight of the archived sources are MIT-licensed and keep
their own LICENSE files. Claude, Claude Code and the Claude Certified Architect programme
are products of [Anthropic](https://www.anthropic.com); this project is not affiliated
with or endorsed by them.

If you authored anything archived here and would rather it weren't, open an issue and it
will be removed and replaced with a link.
