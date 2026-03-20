# require-valid-prompt-argument-hint

Require Copilot prompt-file `argument-hint` metadata to be a non-empty scalar when present.

> **Rule catalog ID:** R041

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- blank `argument-hint` values
- non-scalar `argument-hint` values that do not parse as one string

## Why this rule exists

`argument-hint` is meant to describe the argument shape a prompt expects. If you include it, it should give users and clients a concrete hint rather than an empty or malformed placeholder.

## ❌ Incorrect

```md
---
description: Summarize a change
argument-hint:
---
Summarize the supplied change.
```

## ✅ Correct

```md
---
description: Summarize a change
argument-hint: <pull-request-number>
---
Summarize the supplied change.
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
