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

## Removal

If you authored any material archived here and would rather it not be, open an issue and
it will be removed and replaced with a link.
