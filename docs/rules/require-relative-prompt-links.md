# require-relative-prompt-links

Require Copilot prompt files to use relative Markdown links for workspace files.

> **Rule catalog ID:** R024

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- root-relative Markdown links to workspace files inside prompt bodies
- filesystem-style absolute paths in prompt Markdown links
- `file:` links used instead of repository-relative workspace links

## Why this rule exists

VS Code prompt-file documentation says to reference workspace files with Markdown links that use relative paths based on the prompt file location. Enforcing relative workspace links keeps prompt files portable across machines, folders, and repositories.

## ❌ Incorrect

```md
---
description: Review changes with repository guidance
agent: agent
---
Review the proposed changes using [security guidance](/.github/instructions/security.instructions.md).
```

## ✅ Correct

```md
---
description: Review changes with repository guidance
agent: agent
---
Review the proposed changes using [security guidance](../instructions/security.instructions.md).
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
