# require-chatmode-file-metadata

Require custom Copilot agent files and legacy chat mode files to define a non-empty `description` in frontmatter.

> **Rule catalog ID:** R003

## Targeted pattern scope

- `.github/chatmodes/**/*.chatmode.md`
- `.github/agents/**/*.agent.md`

## What this rule reports

- custom agent or legacy chat mode files with missing or blank `description` frontmatter

## Why this rule exists

The stable rule name is historical, but the rule now covers both modern custom agent files and legacy chat mode files. A short description improves discoverability and keeps the workflow contract explicit.

## ❌ Incorrect

```md
---
tools: [search/codebase]
---
Plan the next implementation step.
```

## ✅ Correct

```md
---
description: Plan and validate a repository-wide refactor
tools: [search/codebase]
---
Plan the next implementation step.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
