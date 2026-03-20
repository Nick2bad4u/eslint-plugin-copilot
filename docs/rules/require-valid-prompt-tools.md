# require-valid-prompt-tools

Require Copilot prompt-file `tools` metadata to be a non-empty list of tool or tool-set names when present.

> **Rule catalog ID:** R027

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- scalar `tools` values such as `tools: fetch`
- empty `tools` values
- empty prompt tool lists such as `tools: []`

## Why this rule exists

VS Code documents reusable prompt-file `tools` metadata as a list. Keeping prompt tool declarations in that documented list form makes the allowed tool surface explicit and easier for Copilot clients to interpret consistently.

## ❌ Incorrect

```md
---
description: Review a pull request
tools: fetch
---
Review the proposed changes.
```

## ✅ Correct

```md
---
description: Review a pull request
tools: ['search/codebase', 'fetch/web']
---
Review the proposed changes.
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
