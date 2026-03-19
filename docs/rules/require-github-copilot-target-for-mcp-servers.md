# require-github-copilot-target-for-mcp-servers

Require Copilot custom agents that declare `mcp-servers` to set `target: github-copilot`.

> **Rule catalog ID:** R010

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- custom agent files that declare `mcp-servers` without any `target`
- custom agent files that declare `mcp-servers` with an empty `target`
- custom agent files that declare `mcp-servers` with a non-`github-copilot` target

## Why this rule exists

The `mcp-servers` frontmatter is specific to GitHub Copilot-targeted custom agents. If a custom agent opts into `mcp-servers` but omits `target: github-copilot`, the file drifts away from the current VS Code contract and can miscommunicate how that agent is meant to run.

## ❌ Incorrect

```md
---
description: Coordinate release automation through MCP servers
target: vscode
mcp-servers: [release-coordinator.json]
---
Coordinate release automation tasks.
```

## ✅ Correct

```md
---
description: Coordinate release automation through MCP servers
target: github-copilot
mcp-servers: [release-coordinator.json]
---
Coordinate release automation tasks.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code January 2026 update notes: Agent extensibility](https://code.visualstudio.com/updates/v1_109)
