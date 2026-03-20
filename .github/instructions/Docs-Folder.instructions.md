---
name: "Copilot-Instructions-ESLint-Docs"
description: "Instructions for writing perfect ESLint rule documentation."
applyTo: "docs/**"
---

<instructions>
## Docs quality bar

- Write rule docs as hand-authored pages, not generated filler.
- Each page should explain what the rule reports, why it exists, how to fix violations, and when disabling it is reasonable.
- Shared tables or sidebars may be generated, but the rule page content itself should stay specific to that rule.

## Rule-doc structure

For `docs/rules/<rule-id>.md`, prefer this order:

1. `# <rule-id>`
2. one-sentence description
3. rule details / rationale
4. `❌ Incorrect` and `✅ Correct` examples
5. options section when applicable
6. when not to use it
7. further reading and the stable rule catalog ID

Use flat-config examples only; do not add legacy `.eslintrc` guidance.

## Style expectations

- Keep tone professional, direct, and concrete.
- Explain the consequence, not just the prohibition.
- If a rule is fixable, state what the fixer changes and any safety limits.
- If a rule needs type information, say so explicitly and mention repo presets when they already wire typed linting for users.
- Ensure examples really trigger the implemented rule.

## Adjacent docs

- Guides, preset pages, `overview.md`, and `getting-started.md` should match the same accuracy bar, but they do not need the full rule-doc section layout.
- Prefer relative repo links for local docs references.
</instructions>
