# require-valid-agent-handoff-send

Require Copilot custom-agent handoff `send` values to use documented boolean metadata when present.

> **Rule catalog ID:** R021

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- custom-agent handoff entries whose `send` value is present but not `true` or `false`
- empty `send` fields in handoff metadata

## Why this rule exists

VS Code documents `handoffs.send` as an optional boolean flag that controls whether the handoff prompt is auto-submitted. Restricting `send` to boolean values keeps guided handoff behavior explicit and aligned with the documented custom-agent frontmatter format.

## ❌ Incorrect

```md
---
description: Generate an implementation plan
handoffs:
  - label: Start Implementation
    agent: implementation
    send: later
---
Create a reviewable implementation plan.
```

## ✅ Correct

```md
---
description: Generate an implementation plan
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Implement the approved plan.
    send: true
---
Create a reviewable implementation plan.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
