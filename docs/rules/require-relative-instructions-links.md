# require-relative-instructions-links

Require path-specific Copilot instructions files to use relative Markdown links for workspace files.

> **Rule catalog ID:** R029

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`

## What this rule reports

- root-relative links such as `/docs/frontend.md`
- file links that use other non-relative workspace-style paths instead of paths relative to the current instructions file

## Why this rule exists

Path-specific instructions often link to coding standards, examples, or package documentation in the repository. Relative links keep those references portable and make it clearer how the linked resource relates to the current instructions file.

## ❌ Incorrect

```md
---
description: Frontend guidance
applyTo: src/**/*.ts
---
See [frontend standards](/docs/frontend.md).
```

## ✅ Correct

```md
---
description: Frontend guidance
applyTo: src/**/*.ts
---
See [frontend standards](../../docs/frontend.md).
```

## Further reading

- [VS Code Docs: Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
