# require-instructions-apply-to

Require path-specific Copilot instructions files to define a non-empty `applyTo` frontmatter glob.

> **Rule catalog ID:** R001

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`

## What this rule reports

- instructions files with missing or blank `applyTo` frontmatter

## Why this rule exists

Path-specific instructions are only useful when Copilot can tell which files they target. Without `applyTo`, the instructions file cannot participate in automatic attachment for matching files.

## ❌ Incorrect

```md
---
description: TypeScript style guidance
---
Use `satisfies` for stable object literals.
```

## ✅ Correct

```md
---
description: TypeScript style guidance
applyTo: "src/**/*.ts"
---
Use `satisfies` for stable object literals.
```

## Further reading

- [VS Code Docs: Reusable instruction files](https://code.visualstudio.com/docs/copilot/copilot-customization#_reusable-instruction-files)
