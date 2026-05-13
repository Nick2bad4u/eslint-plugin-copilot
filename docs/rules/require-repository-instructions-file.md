# require-repository-instructions-file

Require repositories that define Copilot customization assets to also provide repository-level AI guidance in `.github/copilot-instructions.md`, `.github/instructions/copilot-instructions.md`, or a root `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` file.

> **Rule catalog ID:** R005

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## What this rule reports

- Copilot customization assets in repositories that do not include `.github/copilot-instructions.md`, `.github/instructions/copilot-instructions.md`, or a root `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`

## Why this rule exists

Repository-level AI instructions provide the broadest customization surface and are widely supported. When a repository already defines prompts, custom agents, legacy chat modes, agent instructions, or path-specific instructions, a baseline top-level instructions file keeps overall guidance coherent across tools.

## ❌ Incorrect

```text
.github/prompts/review.prompt.md
```

with none of these files in the repository:

- `.github/copilot-instructions.md`
- `.github/instructions/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## ✅ Correct

```text
.github/copilot-instructions.md
.github/prompts/review.prompt.md
```

```text
.github/instructions/copilot-instructions.md
.github/prompts/review.prompt.md
```

```text
AGENTS.md
.github/prompts/review.prompt.md
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
