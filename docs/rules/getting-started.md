# Getting started

`eslint-plugin-copilot` helps teams lint GitHub Copilot customization files in a repository-friendly way.

## Supported file types

- repository-wide instructions: `.github/copilot-instructions.md`
- path-specific instructions: `.github/instructions/**/*.instructions.md`
- reusable prompts: `.github/prompts/**/*.prompt.md`
- custom agents: `.github/agents/**/*.agent.md`
- legacy chat modes: `.github/chatmodes/**/*.chatmode.md`
- skill definitions and supporting Markdown: `.github/skills/**/*.md`, `.claude/skills/**/*.md`
- agent instruction files: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- repository hook configs: `.github/hooks/**/*.json`

## Basic setup

```js
import copilot from "eslint-plugin-copilot";

export default [...copilot.configs.recommended];
```

The preset already configures Markdown support for Copilot content files, JSON support for repository hooks, and the documented file globs for supported Copilot customization assets.
