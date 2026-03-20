---
name: "Copilot-Instructions-ESLint-Testing"
description: "Instructions for writing robust, type-safe tests for ESLint rules using RuleTester, Vitest, and Fast-Check."
applyTo: "test/**, tests/**"
---

<instructions>
## Testing goals

- Use Vitest and `RuleTester` from `@typescript-eslint/rule-tester`.
- Cover valid cases, invalid cases, fixer behavior, and likely false positives.
- Keep typed-rule tests realistic by using shared parser and fixture helpers instead of hand-rolling config in each file.

## Structure

- Prefer the repository's shared helpers for rule lookup, typed fixtures, and tester setup.
- Keep fixture naming predictable.
- For typed tests, pass realistic filenames so parser-service behavior matches real usage.

## Expectations

- Verify exact `messageId`s where possible.
- If a rule is fixable, assert the final `output` explicitly instead of relying on snapshots.
- Add option coverage when a rule is configurable.
- Include edge cases for formatting, unions, `unknown`, and other shapes that could produce false positives or crashes.

## When complexity grows

- Use property-based testing only when it adds real value for parser or traversal edge cases.
- Prefer readable, targeted tests over large opaque generators.
</instructions>
