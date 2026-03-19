# require-valid-agent-invocation-controls

Require Copilot custom-agent invocation-control flags to use documented boolean values when present.

> **Rule catalog ID:** R020

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- invalid `user-invocable` values
- invalid `disable-model-invocation` values
- empty invocation-control fields when those fields are present

## Why this rule exists

VS Code documents `user-invocable` and `disable-model-invocation` as boolean control flags for how a custom agent appears in the agent picker and whether it can be invoked as a subagent. Restricting these fields to boolean values keeps custom-agent invocation behavior explicit and predictable.

## ❌ Incorrect

```md
---
description: Internal helper agent
user-invocable: sometimes
---
Use this agent for internal helper work.
```

## ✅ Correct

```md
---
description: Internal helper agent
user-invocable: false
disable-model-invocation: true
---
Use this agent for internal helper work.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Docs: Subagents](https://code.visualstudio.com/docs/copilot/agents/subagents)
