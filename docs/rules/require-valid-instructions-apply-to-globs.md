# require-valid-instructions-apply-to-globs

Require path-specific Copilot instructions `applyTo` metadata to use repository-relative glob patterns.

> **Rule catalog ID:** R044

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`

## What this rule reports

- `applyTo` entries that start with `./` or `../`
- absolute paths such as `/src/**` or `C:\repo\src\**`
- path-like values that use URI schemes or backslashes
- empty or otherwise non-portable `applyTo` patterns

## Why this rule exists

Path-specific instructions are meant to target files relative to the repository layout. Repository-relative globs are more portable across machines and clients than absolute paths, URI-like references, or current-directory-relative shortcuts.

## ❌ Incorrect

```md
---
description: Frontend guidance
applyTo: ./src/**/*.ts
---
Use explicit return types.
```

## ✅ Correct

```md
---
description: Frontend guidance
applyTo: src/**/*.ts
---
Use explicit return types.
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [VS Code Docs: Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
