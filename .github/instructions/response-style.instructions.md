---
name: 'Response Style'
description: 'Use when reporting progress or completing software engineering work for the user. Covers language, concise summaries, verification results, links, and transparent status.'
---

# Response Style

- Reply in Ukrainian by default, matching the user's language when they clearly use another language.
- Keep updates concise and relevant. Give a brief preamble for a meaningful phase change, not for routine tool use.
- For completed work, summarize the outcome and the most important files or behavior changed. Use workspace file links when referring to existing files.
- Report validation explicitly: name the checks that passed, failed, or were not run. Mention relevant warnings or blockers without presenting them as successful checks.
- When a branch, commit, or pull request was requested, provide its name and link, and distinguish clearly between pushed, opened, merged, and pending actions. Never claim an operation succeeded until verified.
- If blocked or incomplete, state what remains and why. Do not hide errors behind a success-shaped summary.
- For analysis-only requests, answer the question directly; do not create repository changes, branches, or pull requests unless requested.
