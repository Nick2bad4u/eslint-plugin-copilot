# require-valid-agent-mcp-servers

Require Copilot custom-agent `mcp-servers` metadata to be a non-empty list when present.

> **Rule catalog ID:** R023

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- empty `mcp-servers` values in custom-agent frontmatter
- empty `mcp-servers` lists such as `[]`
- scalar `mcp-servers` values instead of the documented list form

## Why this rule exists

VS Code documents `mcp-servers` as an optional list of MCP server config JSON entries for GitHub Copilot-targeted custom agents. Keeping that metadata in the documented list form helps avoid ambiguous or no-op custom-agent configuration.

## ❌ Incorrect

```md
---
description: Coordinate release automation
target: github-copilot
mcp-servers: release-coordinator.json
---
Coordinate release tasks through MCP servers.
```

## ✅ Correct

```md
---
description: Coordinate release automation
target: github-copilot
mcp-servers: ['release-coordinator.json', 'observability.json']
---
Coordinate release tasks through MCP servers.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
