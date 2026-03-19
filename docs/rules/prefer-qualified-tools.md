# prefer-qualified-tools

Prefer fully-qualified tool names in Copilot prompt files, custom agents, and legacy chat modes.

> **Rule catalog ID:** R006

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`

## What this rule reports

- entries in `tools` frontmatter arrays that are not fully qualified with a provider or namespace segment
- except for documented built-in subagent tools such as `agent` and `runSubagent`

## Why this rule exists

Modern Copilot tooling supports fully-qualified tool names such as `search/codebase` to reduce ambiguity between built-in tools, extension-provided tools, and MCP tools.

The built-in `agent` and `runSubagent` tools are exceptions because current VS Code subagent documentation refers to those aliases directly when enabling subagent orchestration.

## ❌ Incorrect

```md
---
description: Release notes helper
agent: agent
tools: [file_search, fetch]
---
Generate release notes for the latest changes.
```

## ✅ Correct

```md
---
description: Release notes helper
agent: agent
tools: [search/file_search, fetch/fetch]
---
Generate release notes for the latest changes.
```

## Further reading

- [VS Code Docs: Reusable prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
