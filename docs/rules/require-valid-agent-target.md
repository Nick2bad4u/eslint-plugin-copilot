# require-valid-agent-target

Require Copilot custom-agent `target` metadata to use a documented target value when present.

> **Rule catalog ID:** R019

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- empty `target` values in custom-agent frontmatter
- custom-agent `target` values other than `vscode` or `github-copilot`

## Why this rule exists

VS Code documents `target` as the target environment or context for a custom agent and currently supports `vscode` and `github-copilot`. Using other target values drifts away from the documented custom-agent contract and can make the agent configuration ambiguous.

This rule intentionally defers to the more specific `require-github-copilot-target-for-mcp-servers` rule when `mcp-servers` metadata is present.

## ❌ Incorrect

```md
---
description: Plan work inside VS Code
target: github
---
Plan work before implementation starts.
```

## ✅ Correct

```md
---
description: Plan work inside VS Code
target: vscode
---
Plan work before implementation starts.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
