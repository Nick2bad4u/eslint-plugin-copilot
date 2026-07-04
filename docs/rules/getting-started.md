# Getting started

`eslint-plugin-copilot` helps teams lint GitHub Copilot customization files in a repository-friendly way.

## Supported file types

- repository-wide instructions: `.github/copilot-instructions.md`, `.github/instructions/copilot-instructions.md`
- path-specific instructions: `.github/instructions/**/*.instructions.md`
- reusable prompts: `.github/prompts/**/*.prompt.md`
- custom agents: `.github/agents/**/*.agent.md`
- legacy chat modes: `.github/chatmodes/**/*.chatmode.md`
- skill definitions and supporting Markdown: `.github/skills/**/*.md`, `.claude/skills/**/*.md`
- agent instruction files: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- repository hook configs: `.github/hooks/**/*.json`

## Basic setup

For direct repository use, install the peer language plugins and use a
self-contained preset:

```sh
npm install --save-dev eslint-plugin-copilot eslint @eslint/markdown @eslint/json
```

```js
import copilot from "eslint-plugin-copilot";

export default [...copilot.configs.recommended];
```

The preset already configures Markdown support for Copilot content files, JSON support for repository hooks, and the documented file globs for supported Copilot customization assets.

## Shareable config setup

If a shareable config already registers `@eslint/markdown` as `markdown` and
`@eslint/json` as `json`, use the matching no-language-plugin variant after that
registration:

```js
import copilot from "eslint-plugin-copilot";
import sharedConfig from "your-shared-eslint-config";

export default [
 ...sharedConfig,
 ...copilot.configs["recommended-without-language-plugins"],
];
```

The no-language-plugin variants keep the same `files`, `language`, and Copilot
rules as the self-contained presets, but they do not register `plugins.markdown`
or `plugins.json`. They rely on an earlier matching flat config entry to provide
those language plugins for `language: "markdown/gfm"` and
`language: "json/json"`.
