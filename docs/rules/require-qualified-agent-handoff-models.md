# require-qualified-agent-handoff-models

Require Copilot custom-agent handoff models to use qualified `Model Name (vendor)` names.

> **Rule catalog ID:** R013

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- handoff entries whose `model` value is present but not written in a qualified format such as `GPT-5 (copilot)`

## Why this rule exists

VS Code custom-agent docs specify that `handoffs.model` should use a qualified model name in the format `Model Name (vendor)`. That keeps handoff execution explicit and avoids ambiguous shorthand model names in multi-vendor Copilot environments.

## ❌ Incorrect

```md
---
description: Plan work carefully
handoffs:
  - label: Start Implementation
    agent: Implementer
    model: GPT-5
---
Plan the requested change before implementation.
```

## ✅ Correct

```md
---
description: Plan work carefully
handoffs:
  - label: Start Implementation
    agent: Implementer
    model: GPT-5 (copilot)
---
Plan the requested change before implementation.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
