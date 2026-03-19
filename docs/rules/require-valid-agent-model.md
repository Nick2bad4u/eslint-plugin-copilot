# require-valid-agent-model

Require Copilot custom-agent `model` metadata to be a non-empty model name or non-empty prioritized list of model names when present.

> **Rule catalog ID:** R022

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- empty custom-agent `model` values
- empty custom-agent model lists such as `[]`
- malformed model list literals that collapse to an empty list

## Why this rule exists

VS Code documents custom-agent `model` as either a single model name string or a prioritized array of model names. Keeping `model` metadata in one of those documented shapes helps ensure model overrides are intentional and usable.

## ❌ Incorrect

```md
---
description: Implement approved changes
model: []
---
Implement the requested changes.
```

## ✅ Correct

```md
---
description: Implement approved changes
model: ['Claude Haiku 4.5 (copilot)', 'GPT-5 (copilot)']
---
Implement the requested changes.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
