# require-existing-relative-prompt-links

Require relative Markdown links in Copilot prompt files to resolve to existing workspace targets.

> **Rule catalog ID:** R030

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- relative links whose resolved workspace target does not exist

## Why this rule exists

Relative links are only useful when they actually resolve. Broken prompt links can hide important context, examples, or runbooks from the people and tools invoking the prompt.

## ❌ Incorrect

```md
---
description: Review a pull request
---
See [review guide](../docs/review-guide.md).
```

when `../docs/review-guide.md` does not exist from the prompt file.

## ✅ Correct

```md
---
description: Review a pull request
---
See [review guide](../../docs/review-guide.md).
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
