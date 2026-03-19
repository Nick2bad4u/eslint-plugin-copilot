# eslint-plugin-copilot

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-copilot?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-copilot/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-copilot?color=pink)](https://www.npmjs.com/package/eslint-plugin-copilot) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-copilot?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-copilot/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-copilot?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-copilot/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-copilot?color=green)](https://github.com/Nick2bad4u/eslint-plugin-copilot/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-copilot?color=red)](https://github.com/Nick2bad4u/eslint-plugin-copilot/issues) [![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-copilot/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-copilot)

ESLint plugin for linting GitHub Copilot repository customization files such as:

- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`

The plugin focuses on repository setup quality, metadata correctness, and modern GitHub Copilot customization conventions.

## Table of contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [What the presets lint](#what-the-presets-lint)
4. [Presets](#presets)
5. [Rules](#rules)
6. [Contributors ✨](#contributors-)

## Installation

```sh
npm install --save-dev eslint-plugin-copilot eslint
```

### Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only (`eslint.config.*`)
- **Node.js runtime:** `>=22.0.0`

## Quick start

```js
import copilot from "eslint-plugin-copilot";

export default [copilot.configs.recommended];
```

The shipped presets already configure:

- `plugins.markdown` via `@eslint/markdown`
- `language: "markdown/gfm"`
- Copilot customization file globs for repository instructions, path-specific instructions, prompt files, custom agents, legacy chat modes, and agent-instructions files

## What the presets lint

The built-in presets target these markdown file patterns:

- `.github/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `**/AGENTS.md`
- `**/CLAUDE.md`
- `**/GEMINI.md`

## Presets

This plugin intentionally exports four presets:

| Preset                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) [`copilot.configs.minimal`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal)             |
| [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [`copilot.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) |
| [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [`copilot.configs.strict`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict)                |
| [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) [`copilot.configs.all`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)                         |

### Configuration examples by preset

```js
import copilot from "eslint-plugin-copilot";

export default [
  copilot.configs.minimal,
  // copilot.configs.recommended,
  // copilot.configs.strict,
  // copilot.configs.all,
];
```

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) — [`copilot.configs.minimal`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal)
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) — [`copilot.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended)
  - [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) — [`copilot.configs.strict`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict)
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) — [`copilot.configs.all`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)

| Rule                                                                                                                                         | Fix | Preset key                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------- | :-: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`no-blank-repository-instructions`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-repository-instructions)         |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)                                                                                     |
| [`prefer-qualified-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-qualified-tools)                             |  —  | [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)                                                                                                                                                                                                                                                                |
| [`require-chatmode-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-chatmode-file-metadata)             |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) |
| [`require-instructions-apply-to`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-instructions-apply-to)               |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) |
| [`require-prompt-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-prompt-file-metadata)                 |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) |
| [`require-repository-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-instructions-file) |  —  | [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)                                                                                                                                                                             |

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors.](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
