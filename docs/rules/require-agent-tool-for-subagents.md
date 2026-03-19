# require-agent-tool-for-subagents

Require Copilot custom agents that declare subagents to also include the `agent` tool.

> **Rule catalog ID:** R008

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- custom agent files that declare `agents` without also declaring a `tools` list
- custom agent files that declare `agents` but omit the `agent` tool from `tools`

## Why this rule exists

VS Code custom agents can restrict which subagents are available through the `agents` frontmatter property. The current contract requires those agent files to also include the `agent` tool in `tools`; otherwise subagent orchestration is configured incompletely.

## ❌ Incorrect

```md
---
description: Build features by delegating to specialist agents
tools: [search/codebase, fetch/fetch]
agents: [Researcher, Implementer]
---
Research first, then delegate implementation.
```

## ✅ Correct

```md
---
description: Build features by delegating to specialist agents
tools: [agent, search/codebase, fetch/fetch]
agents: [Researcher, Implementer]
---
Research first, then delegate implementation.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
