# require-chatmode-file-metadata

Require custom Copilot chat mode files to define a non-empty `description` in frontmatter.

> **Rule catalog ID:** R003

## Targeted pattern scope

- `.github/chatmodes/**/*.chatmode.md`

## What this rule reports

- chat mode files with missing or blank `description` frontmatter

## Why this rule exists

Chat modes are reusable, user-facing workflows. A short description improves discoverability and keeps the mode contract explicit.

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

- [VS Code Docs: Custom chat modes](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-chat-modes)
