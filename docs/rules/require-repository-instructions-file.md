# require-repository-instructions-file

Require repositories that define Copilot customization assets to also provide `.github/copilot-instructions.md`.

> **Rule catalog ID:** R005

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/chatmodes/**/*.chatmode.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## What this rule reports

- Copilot customization assets in repositories that do not also include `.github/copilot-instructions.md`

## Why this rule exists

Repository-wide instructions provide the broadest Copilot customization surface and are widely supported. When a repository already defines prompts, chat modes, agent instructions, or path-specific instructions, a baseline repository instructions file keeps the overall guidance coherent.

## ❌ Incorrect

```text
.github/prompts/review.prompt.md
```

with no `.github/copilot-instructions.md` in the repository.

## ✅ Correct

```text
.github/copilot-instructions.md
.github/prompts/review.prompt.md
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
