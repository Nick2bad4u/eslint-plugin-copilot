# require-valid-prompt-model

Require Copilot prompt-file `model` metadata to be a non-empty single model name when present.

> **Rule catalog ID:** R026

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- empty prompt-file `model` values
- prompt-file `model` lists where the docs only describe a single model field
- malformed list literals such as `model: []`

## Why this rule exists

VS Code documents prompt-file `model` as the language model used when running the prompt. Unlike custom agents, the prompt-file docs do not describe a prioritized model array shape, so keeping prompt `model` metadata to a single non-empty model name keeps prompt configuration aligned with the documented contract.

## ❌ Incorrect

```md
---
description: Review changes
agent: plan
model: ['Claude Haiku 4.5 (copilot)', 'GPT-5 (copilot)']
---
Review the requested changes.
```

## ✅ Correct

```md
---
description: Review changes
agent: plan
model: GPT-5 (copilot)
---
Review the requested changes.
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
