# require-prompt-file-metadata

Require reusable Copilot prompt files to declare `description`, `mode`, and agent-mode `tools` metadata.

> **Rule catalog ID:** R002

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- prompt files with missing or blank `description`
- prompt files with missing or blank `mode`
- agent-mode prompt files without `tools`

## Why this rule exists

Prompt files are reusable requests. Explicit metadata makes them easier to understand, safer to run, and more consistent across repositories.

## ❌ Incorrect

```md
---
description: Review this repository
mode: agent
---
Audit the repository for stale branding and broken docs links.
```

## ✅ Correct

```md
---
description: Review this repository
mode: agent
tools: [search/file_search, search/read_file]
---
Audit the repository for stale branding and broken docs links.
```

## Further reading

- [VS Code Docs: Reusable prompt files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
