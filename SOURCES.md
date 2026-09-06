# Sources

Every source that fed this repo, what it contributed, and under what terms. Archived
copies live under `sources/` unchanged from upstream — no edits, no reformatting — so the
provenance of any question can always be traced back.

---

## 1. OlivierAlter — Claude Certified Architect Foundations Certification Exam

- **URL:** https://github.com/OlivierAlter/Claude-Certified-Architect-Foundations-Certification-Exam
- **Author:** Olivier Legris (Claude Ambassador, co-founder of [Alter](https://www.alterhq.com))
- **Archived at:** `sources/olivier-alter/`
- **Contributed:** **77 questions** — the single largest and most systematically organised
  source. Questions are indexed against all 30 official task statements across the five
  domains, with a separate answer-key table.
- **Also includes:** `cert-exam.skill`, a Claude Code skill that runs the exam
  interactively in the terminal with domain-by-domain scoring.
- **Licence:** No `LICENSE` file published upstream. Archived here for study and
  attribution; the author's stated position is that it is a community resource built from
  publicly available information, explicitly not part of the Claude Ambassador programme
  and not involving Anthropic.

## 2. hamzafarooq — claude-certified-architect

- **URL:** https://github.com/hamzafarooq/claude-certified-architect
- **Author:** Hamza Farooq
- **Archived at:** `sources/hamza-farooq/`
- **Contributed:** **62 questions** (55 from `practice-exam.html`, 10 from
  `quick-quiz.html`, 3 deduplicated against other sources). Explanations here are the
  strongest of any source — most lead with a one-line principle in bold before the
  reasoning.
- **Also includes:** five domain cheat-sheets (`cheat-sheet/domain1.md` … `domain5.md`,
  ~112 KB total) and `sample-questions.md`, which reproduces the official sample questions
  from the exam guide.
- **Licence:** **MIT** — `sources/hamza-farooq/LICENSE`, © 2025 Hamza Farooq.

## 3. dnacenta — claude-certified-architect

- **URL:** https://github.com/dnacenta/claude-certified-architect
  (published at https://dnacenta.github.io/claude-certified-architect/)
- **Archived at:** `sources/dnacenta/`
- **Contributed:** No questions — this is the **reference study guide**. Five domain
  deep-dives (~133 KB), decision frameworks, anti-patterns, a 4-week study plan, and
  overviews of the three sibling certifications (CCAO-F, CCAR-P, CCDV-F).
- **Notable:** its code examples already target `claude-opus-5`, and it is the source of
  the exam-logistics facts used here (60 questions / 120 minutes / 720 to pass / Pearson
  VUE / registration via `anthropic.skilljar.com`).
- **Licence:** No explicit licence file; README states it is an unofficial community study
  guide, unaffiliated with Anthropic. Archived with attribution.

## 4. mc-marcocheng — Claude Certified Architect Practice Exam (gist)

- **URL:** https://gist.github.com/mc-marcocheng/a043615e2332a6760f682cb03c45b255
- **Archived at:** `sources/marco-cheng-gist/practice-exam.md`
- **Contributed:** **72 questions.** The gist numbers them 1–60 but restates its first
  twelve in a second, longer-form pass — so it yields 72 distinct blocks. Repeats are
  ref-suffixed (`Q7`, `Q7b`) rather than discarded, because the second pass carries fuller
  stems and better reasoning.
- **Format quirk:** the correct option is flagged inline with `**[CORRECT]**` and the
  rationale appears as a `**Why X:**` line.
- **Attribution chain:** the gist itself credits
  `paullarionov/claude-certified-architect` → `guide_en.MD` as its origin. That repo/path
  now returns 404, so the gist is the earliest surviving copy.
- **Licence:** Public GitHub gist, no stated licence. Archived with attribution.

## 5. K21 Academy — CCAR-F Labs: Build AI Agents

- **URL:** https://k21academy.com/claude/ccar-f-labs-build-ai-agents/
- **Archived at:** `sources/k21academy/notes.md` (summary — the page is commercial
  courseware and is not reproduced in full)
- **Contributed:** No questions. It is the best public description of the **exam
  logistics and lab curriculum**: 60 questions, 120 minutes, 720/1000 to pass, $125 USD,
  4 scenarios drawn at random from a bank of 6, credential valid 12 months, and a 33+ lab
  progression from architecture mapping through production hardening.
- **Licence:** Commercial content, © K21 Academy. Summarised and linked only.

## 6. ExamHeist — Claude Certified Architect Foundations questions

- **URL:** https://www.examheist.com/exam/anthropic/claude-certified-architect/1/
- **Archived at:** `sources/examheist/notes.md`
- **Contributed:** **Nothing.** The page renders entirely client-side; a plain fetch
  returns only the document title and no question bodies, options or answers. Listed for
  completeness so the source list matches what was actually attempted.
- **Licence:** Commercial content, © ExamHeist. Not reproduced.

## 7. Anthropic — Claude Certified Developer – Foundations (CCDV-F) announcement

- **URL:** https://www.facebook.com/100071489252639/videos/-build-the-future-of-ai-applications-with-claude-certified-developer-foundations/2776107429428871/
- **Archived at:** `sources/facebook-ccdv-f/notes.md`
- **Contributed:** No questions. Context on the **adjacent** certification: CCDV-F is the
  *developer* track, examining seven domains (Applications and Integration; Model
  Selection and Optimization; Agents and Workflows; Prompt and Context Engineering; Tools
  and MCPs; Security and Safety; AI Evaluation, Testing and Debugging). Recorded here to
  keep the two credentials from being confused — this repo targets **CCAR-F**, the
  architect track.
- **Licence:** Video content, © Anthropic. Summarised and linked only.

---

## What "archived verbatim" means

Files under `sources/` are byte-for-byte upstream copies (clones with `.git` removed).
Nothing in the pipeline writes back into `sources/` — the parsers read, `data/` is the
only write target. That keeps re-fetching an upstream and diffing it against the archive a
one-command check.

---

# Wave 2 — added 2026-09-06

The first four sources are above. A wider sweep of the `ccar-f` / `cca-f` GitHub topics
turned up a much larger ecosystem; these eight contributed questions and seven more
shaped the cheat sheets without contributing any.

## 8. utkarsh1agarwal — claude-architect-exam-guide

- **URL:** https://github.com/utkarsh1agarwal/claude-architect-exam-guide
- **Archived at:** `sources/utkarsh-mocks/`
- **Contributed:** **341 questions** — the largest single source in the bank. Six full
  60-question mock exams, each organised around all six official scenarios, with separate
  answer-key files carrying domain tags and per-question rationale.
- **Format:** `exam-N-questions.md` + `exam-N-answers.md`. Exams 1/4/5/6 use prose answer
  keys with rationale; exams 2/3 use a compact table with none, so those items carry the
  answer but a thinner explanation.
- **Stance worth repeating:** the author states every item is written against the public
  blueprint, not drawn from real exam content.
- **Licence:** **MIT**.

## 9. pankajarm — cca-f-game ("Architect's Ascent")

- **URL:** https://github.com/pankajarm/cca-f-game
- **Archived at:** `sources/architects-ascent/`
- **Contributed:** **192 questions**, keyed by game "floor" in a `window.BANK` literal,
  each with an explanation, a hint, a difficulty and domain tags. Described upstream as
  "generated and adversarially verified June 2026".
- **Licence:** No LICENSE file. Archived with attribution.

## 10. kamiimeteor — cca-f-dojo

- **URL:** https://github.com/kamiimeteor/cca-f-dojo
- **Archived at:** `sources/cca-f-dojo/`
- **Contributed:** **168 questions** — and the highest quality per item of any source.
  Indexed against all 30 official task statements, with difficulty ratings, a marked
  "strongest distractor", **per-distractor explanations**, and multiple-response items.
- **Format quirk:** bilingual. `assets/data/questions.js` holds the authoritative
  structure with Chinese text; `content.en.q1.js` / `content.en.q2.js` overlay English by
  id. The parser merges the two and skips any item lacking an English overlay.
- **Licence:** **MIT**.

## 11. Amey-Thakur — CLAUDE-CERTIFICATIONS

- **URL:** https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS
- **Archived at:** `sources/amey-thakur/`
- **Contributed:** **80 questions** (40 practice + three 60-item mocks, filtered to
  `architect-foundations`). Clean `question-bank.json` with options as a letter map,
  answer letter, and a rationale.
- **Also contains** 240 further questions for the sibling certifications (CCAO-F, CCDV-F,
  CCAR-P) which are *not* merged into this bank — different exams, different blueprints.
  They are archived and available if you are sitting one of those.
- **Licence:** **MIT**.

## 12. mominurr — cca-f-mock-exam

- **URL:** https://github.com/mominurr/cca-f-mock-exam
- **Archived at:** `sources/mominurr-mock/`
- **Contributed:** **60 questions**, domain-aligned, each with an explanation *and* a
  `wrongAnswerExplanations` map covering every distractor.
- **Licence:** **MIT**.

## 13. olgun-yilmaz — ClaudeCertifiedArchitectFoundations

- **URL:** https://github.com/olgun-yilmaz/ClaudeCertifiedArchitectFoundations
- **Archived at:** `sources/olgun-generated/`
- **Contributed:** **52 unique questions** from 110 parsed — its four generated exams
  reuse items across sets, so 58 deduped away. Every item carries domain, subtopic,
  scenario, an explanation and a `Why-A`..`Why-D` breakdown.
- **Also includes** a `cert-exam-generator` Claude skill and an exam simulator.
- **Licence:** **MIT**.

## 14. shourabhmodak — claude-certified-architect-exam-prep

- **URL:** https://github.com/shourabhmodak/claude-certified-architect-exam-prep
- **Archived at:** `sources/shourabh-simulator/`
- **Contributed:** **20 questions** from `cca-f-simulator.html`. Notable for being the
  only source with **code-block stems** — you are shown a snippet of a broken agentic
  loop and asked what is wrong. Those render as code on the site.
- **Also includes** five domain cheat sheets and a quick-reference.
- **Licence:** No LICENSE file. Archived with attribution.

## 15. timothywarner-org — claude-architect

- **URL:** https://github.com/timothywarner-org/claude-architect
- **Archived at:** `sources/tim-warner/` (markdown docs + `practice-questions.json` only —
  the full repo vendors ~550 MB of notebooks and cookbooks)
- **Contributed:** **0 unique questions.** All 60 deduped against the mc-marcocheng gist.
  Both descend from Paul Larionov's study repo, which the repo credits explicitly and
  which now 404s. The merge found this independently, which is a good sign for the
  dedup rule.
- **Still valuable for:** five domain reference guides, `EXAM-STUDY-PATH.md` and an
  `EMERGENCY-CARD.md` that fed the cheat sheets.
- **Licence:** **MIT**, © Tim Warner.

---

# Sources that shaped the guides but contributed no questions

Archived because the cheat sheets are distilled from them.

| Source | Archived at | What it gave |
|---|---|---|
| [vkorost/claude-certified-architect-guide](https://github.com/vkorost/claude-certified-architect-guide) | `sources/vkorost-book/` | A 12-chapter book (~740 KB); the deepest treatment of escalation, provenance and error propagation |
| [preporato/claude-certification-guide](https://github.com/preporato/claude-certification-guide) | `sources/preporato-guides/` | Study guides for all four Claude certifications (147★, the most-starred in the topic) |
| [DaStru/cca-f-cheat-sheet](https://github.com/DaStru/cca-f-cheat-sheet) | `sources/dastru-cheatsheet/` | A single dense revision sheet |
| [AgustinVillagran/cca-f-study-guide](https://github.com/AgustinVillagran/cca-f-study-guide) | `sources/agustin-guide/` | Mental models and anti-patterns framing |
| [dnacenta/claude-certified-architect](https://github.com/dnacenta/claude-certified-architect) | `sources/dnacenta/` | Five domain deep-dives; the exam-logistics facts |
| [hamzafarooq/claude-certified-architect](https://github.com/hamzafarooq/claude-certified-architect) | `sources/hamza-farooq/` | Five domain cheat sheets + the official sample questions |
| [K21 Academy](https://k21academy.com/claude/ccar-f-labs-build-ai-agents/) | `sources/k21academy/` | Exam logistics and the 33-lab curriculum |

# Deliberately not scraped

Commercial banks that advertise large question counts behind a paywall — ExamHeist (175),
CertStud (300+), Preporato practice tests (360), CertificationPractice (360), SkillCertPro,
and the Udemy course. Their content is client-rendered and paid; taking it would be both a
licence problem and unverifiable. Every question in this bank is openly published,
attributable, and carries a written explanation, which is what makes it useful for study.

---

## Removal

If you authored any material archived here and would rather it not be, open an issue and
it will be removed and replaced with a link.
