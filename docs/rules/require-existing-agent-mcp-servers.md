# require-existing-agent-mcp-servers

Require Copilot custom-agent `mcp-servers` entries to resolve to existing repository files.

> **Rule catalog ID:** R033

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- `mcp-servers` entries that point to missing repository files

## Why this rule exists

Declaring an MCP server file is only useful when the referenced configuration actually exists. Broken `mcp-servers` entries make an agent's declared tool integrations misleading and fragile.

## ❌ Incorrect

```md
---
description: Release coordinator
mcp-servers: ['mcp/release.json']
---
Coordinate the release.
```

when `mcp/release.json` does not exist in the repository.

## ✅ Correct

```md
---
description: Release coordinator
mcp-servers: ['.vscode/mcp/release.json']
---
Coordinate the release.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
