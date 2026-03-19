# no-blank-repository-instructions

Disallow empty repository-wide Copilot instructions files.

> **Rule catalog ID:** R004

## Targeted pattern scope

- `.github/copilot-instructions.md`

## What this rule reports

- repository-wide instructions files whose visible body content is blank after trimming comments and whitespace

## Why this rule exists

GitHub Copilot repository instructions are the baseline customization surface for a repository. An empty `.github/copilot-instructions.md` file communicates intent to customize Copilot, but it provides no usable guidance.

## ❌ Incorrect

```md
<!-- placeholder -->
```

## ✅ Correct

```md
# Repository guidance

- Prefer Flat Config for ESLint.
- Run `npm test` before proposing changes.
- Keep prompt files in `.github/prompts/` and path-specific instructions in `.github/instructions/`.
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
