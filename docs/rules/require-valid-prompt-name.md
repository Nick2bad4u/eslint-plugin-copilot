# require-valid-prompt-name

Require Copilot prompt-file `name` metadata to be a non-empty scalar when present.

> **Rule catalog ID:** R040

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- blank `name` values
- non-scalar `name` values that do not parse as a single string in supported frontmatter

## Why this rule exists

Prompt files can expose a slash-command name through frontmatter. When `name` is present, it should be a real string value instead of an empty placeholder so the prompt has a stable, intentional command name.

## ❌ Incorrect

```md
---
description: Review a pull request
name:
---
Review the proposed changes.
```

## ✅ Correct

```md
---
description: Review a pull request
name: review-pr
---
Review the proposed changes.
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
