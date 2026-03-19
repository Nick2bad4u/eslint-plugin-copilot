# require-prompt-file-metadata

Require reusable Copilot prompt files to declare `description`, `agent`, and built-in agent-mode `tools` metadata.

> **Rule catalog ID:** R002

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- prompt files with missing or blank `description`
- prompt files with missing or blank `agent`
- prompt files that still use deprecated `mode`
- built-in `agent` prompt files without `tools`

## Why this rule exists

Prompt files are reusable requests. Explicit metadata makes them easier to understand, safer to run, and more consistent across repositories. Current VS Code prompt files use `agent` instead of the older `mode` key.

## ❌ Incorrect

```md
---
description: Review this repository
agent: agent
---
Audit the repository for stale branding and broken docs links.
```

## ✅ Correct

```md
---
description: Review this repository
agent: agent
tools: [search/file_search, search/read_file]
---
Audit the repository for stale branding and broken docs links.
```

## Further reading

- [VS Code Docs: Reusable prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
