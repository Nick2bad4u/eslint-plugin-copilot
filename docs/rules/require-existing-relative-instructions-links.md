# require-existing-relative-instructions-links

Require relative Markdown links in path-specific Copilot instructions files to resolve to existing workspace targets.

> **Rule catalog ID:** R032

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`

## What this rule reports

- relative instructions links whose resolved workspace target does not exist

## Why this rule exists

Path-specific instructions commonly link to package-specific conventions or local examples. Broken links weaken those instructions by pointing reviewers and coding agents at context that is no longer there.

## ❌ Incorrect

```md
---
description: Frontend guidance
applyTo: src/**/*.ts
---
See [frontend standards](../../docs/frontend.md).
```

when `../../docs/frontend.md` does not exist from the instructions file.

## ✅ Correct

```md
---
description: Frontend guidance
applyTo: src/**/*.ts
---
See [frontend standards](../../docs/standards/frontend.md).
```

## Further reading

- [VS Code Docs: Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
