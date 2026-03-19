# require-valid-agent-subagents

Require Copilot custom-agent `agents` metadata to be `*`, `[]`, or a non-empty list of explicit agent names.

> **Rule catalog ID:** R017

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- scalar `agents` values other than `*`
- malformed `agents` metadata that is neither `*`, `[]`, nor a list of explicit agent names
- wildcard list entries such as `['*', 'Planner']`

## Why this rule exists

VS Code documents the `agents` field as accepting one of three shapes: a list of allowed agent names, `*` to allow all available subagents, or `[]` to disable subagent use. Keeping that metadata in one of the documented forms makes subagent orchestration predictable and avoids accidental misconfiguration.

## ❌ Incorrect

```md
---
description: Coordinate feature work
agents: Planner
---
Use subagents when helpful.
```

## ✅ Correct

```md
---
description: Coordinate feature work
agents: ['Planner', 'Reviewer']
---
Use subagents when helpful.
```

```md
---
description: Stay in the current agent only
agents: []
---
Do not use subagents for this workflow.
```

## Further reading

- [VS Code Docs: Subagents](https://code.visualstudio.com/docs/copilot/agents/subagents)
- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
