# Getting started

`eslint-plugin-copilot` helps teams lint GitHub Copilot customization files in a repository-friendly way.

## Supported file types

- repository-wide instructions: `.github/copilot-instructions.md`
- path-specific instructions: `.github/instructions/**/*.instructions.md`
- reusable prompts: `.github/prompts/**/*.prompt.md`
- custom chat modes: `.github/chatmodes/**/*.chatmode.md`
- agent instruction files: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`

## Basic setup

```js
import copilot from "eslint-plugin-copilot";

export default [copilot.configs.recommended];
```

The preset already configures markdown language support and file globs for the supported Copilot customization files.
