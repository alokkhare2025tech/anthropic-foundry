# ExamHeist — Claude Certified Architect Foundations

Source: https://www.examheist.com/exam/anthropic/claude-certified-architect/1/
Attempted: 2026-09-06
Contributed to the bank: **nothing**

## Why there is no archived copy

The page is a client-rendered single-page app. A plain HTTP fetch with a browser
user-agent returns ~51 KB of HTML whose entire visible text is:

```
Claude Certified Architect - Foundations Exam Questions & Answers 2026 |
Claude Certified Architect – Foundations (CCA-F) Certification | ExamHeist
```

The word "question" appears 126 times in the markup — all in scaffolding, navigation and
meta tags. There is no `__NEXT_DATA__` blob, no embedded JSON payload, and no question
text, options or answers anywhere in the server response. The content is fetched after
hydration and, past the first free item, sits behind a paywall.

## Decision

Not scraped. Rendering the page in a headless browser to pull paywalled commercial
question content would be both a licence problem and an accuracy problem — the four
sources that *are* archived here are openly published, attributable, and carry written
explanations, which is what makes them useful for study.

This file exists so the source list in [SOURCES.md](../../SOURCES.md) reflects everything
that was attempted, not just what succeeded.
