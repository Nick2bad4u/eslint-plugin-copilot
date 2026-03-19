# require-valid-agent-handoffs

Require Copilot custom-agent handoffs to define the metadata needed for usable guided transitions.

> **Rule catalog ID:** R012

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- handoff entries that omit a non-empty `label`
- handoff entries that omit a non-empty `agent`
- handoff entries that set `send: true` without also defining a non-empty `prompt`

## Why this rule exists

VS Code custom-agent handoffs are meant to create guided transitions between agents. The documentation describes each handoff as specifying a button label and a target agent, with an optional prompt to send. If a repository defines incomplete handoff entries, the workflow becomes ambiguous or unusable.

When `send: true` is set, the prompt is auto-submitted as the next step. Requiring a prompt in that case keeps the handoff explicit instead of auto-submitting an empty request.

## ❌ Incorrect

```md
---
description: Plan work carefully
handoffs:
  - label: Start Implementation
    send: true
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
    prompt: Implement the approved plan.
    send: true
---
Plan the requested change before implementation.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
