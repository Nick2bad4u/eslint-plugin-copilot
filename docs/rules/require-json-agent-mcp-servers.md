# require-json-agent-mcp-servers

Require Copilot custom-agent `mcp-servers` entries to reference JSON config files.

> **Rule catalog ID:** R034

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- `mcp-servers` entries that do not end in `.json`

## Why this rule exists

In practice, custom-agent `mcp-servers` entries are repository file references to MCP server configuration documents. Requiring `.json` targets makes those references more explicit and catches obvious misconfigurations early.

## ❌ Incorrect

```md
---
description: Release coordinator
mcp-servers: ['release-server']
---
Coordinate the release.
```

## ✅ Correct

```md
---
description: Release coordinator
mcp-servers: ['release-server.json']
---
Coordinate the release.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
