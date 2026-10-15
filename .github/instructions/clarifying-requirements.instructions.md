---
name: 'Clarifying Requirements'
description: 'Use when a software request has ambiguous scope, multiple plausible behaviors, meaningful trade-offs, or unresolved edge cases. Guides when and how to ask the user before implementation.'
---

# Clarifying Requirements

- Start implementation when the request and repository context make the intended outcome clear. Do not ask for confirmation of details that can be safely inferred from existing conventions.
- Ask before implementing when different reasonable interpretations would materially change user-visible behavior, data shape, security, compatibility, feature scope, or the amount of work.
- Ask when a required product decision or important edge case cannot be determined from the request, existing behavior, tests, or project documentation. Do not silently choose a consequential behavior.
- Before asking, inspect relevant code and tests for established behavior and prior art. Ask only about what remains genuinely undecided.
- Use the available question tool; ask one focused question at a time and prefer a small set of concrete choices when practical.
- State the decision that needs to be made in neutral, concise language. Recommend an option only when repository evidence supports it, and briefly state why.
- Do not ask questions whose answers are already specified in project instructions, the current task, or existing code. Do not block on minor reversible implementation choices; choose the simplest convention-consistent option and mention the assumption in the completion summary if it matters.
- If a blocker prevents safe progress, explain what is blocked and wait for the user's decision instead of implementing a speculative fallback.
