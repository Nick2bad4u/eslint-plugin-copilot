# eslint-plugin-copilot

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-copilot?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-copilot/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-copilot?color=pink)](https://www.npmjs.com/package/eslint-plugin-copilot) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-copilot?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-copilot/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-copilot?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-copilot/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-copilot?color=green)](https://github.com/Nick2bad4u/eslint-plugin-copilot/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-copilot?color=red)](https://github.com/Nick2bad4u/eslint-plugin-copilot/issues) [![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-copilot/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-copilot)

ESLint plugin for linting GitHub Copilot repository customization files such as:

- `.github/copilot-instructions.md`
- `.github/instructions/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`

The plugin focuses on repository setup quality, metadata correctness, and modern GitHub Copilot customization conventions.

> **Oxlint:** Not compatible (verified with Oxlint 1.80.0); all 69 rules and eight presets target Markdown or JSON through the `@eslint/markdown` and `@eslint/json` language plugins, while [Oxlint JavaScript plugins do not support custom formats](https://oxc.rs/docs/guide/usage/linter/js-plugins.html#api-support). Use ESLint for these Copilot customization files.

## Table of contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [What the presets lint](#what-the-presets-lint)
4. [Presets](#presets)
5. [Rules](#rules)
6. [Contributors ✨](#contributors-)

## Installation

```sh
npm install --save-dev eslint-plugin-copilot eslint @eslint/markdown @eslint/json
```

### Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only (`eslint.config.*`)
- **Node.js runtime:** `>=22.0.0`

## Quick start

For direct use in an application or repository, use the self-contained presets:

```js
import copilot from "eslint-plugin-copilot";

export default [...copilot.configs.recommended];
```

The shipped presets already configure:

- `plugins.markdown` via `@eslint/markdown`
- `plugins.json` via `@eslint/json` for repository hooks
- `language: "markdown/gfm"`
- `language: "json/json"` for `.github/hooks/*.json`
- Copilot customization file globs for repository instructions, path-specific instructions, prompt files, custom agents, legacy chat modes, skills, agent-instructions files, and repository hooks

Shareable configs that already register `@eslint/markdown` and `@eslint/json`
should use the no-language-plugin variants after that registration instead:

```js
import copilot from "eslint-plugin-copilot";
import sharedConfig from "your-shared-eslint-config";

export default [
 ...sharedConfig,
 ...copilot.configs["recommended-without-language-plugins"],
];
```

Those variants keep the same `files`, `language`, and `copilot` rule layers, but
they do not register `plugins.markdown` or `plugins.json`. Use them only when an
earlier matching flat config entry already registers `markdown` from
`@eslint/markdown` and `json` from `@eslint/json`; otherwise ESLint cannot
resolve `language: "markdown/gfm"` or `language: "json/json"`.

## What the presets lint

The built-in presets target these Markdown file patterns:

- `.github/copilot-instructions.md`
- `.github/instructions/copilot-instructions.md`
- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `.github/skills/**/*.md`
- `.claude/skills/**/*.md`
- `**/SKILL.md`
- `**/AGENTS.md`
- `**/CLAUDE.md`
- `**/GEMINI.md`

They also target these JSON file patterns:

- `.github/hooks/**/*.json`

## Presets

This plugin intentionally exports four presets:

| Self-contained preset                                                                                                                                                                                      | No-language-plugin variant                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [🟢](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal) [`copilot.configs.minimal`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/minimal)             | `copilot.configs["minimal-without-language-plugins"]`     |
| [🟡](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) [`copilot.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/recommended) | `copilot.configs["recommended-without-language-plugins"]` |
| [🔴](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict) [`copilot.configs.strict`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/strict)                | `copilot.configs["strict-without-language-plugins"]`      |
| [🟣](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all) [`copilot.configs.all`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets/all)                         | `copilot.configs["all-without-language-plugins"]`         |

### Configuration examples by preset

```js
import copilot from "eslint-plugin-copilot";

export default [
 ...copilot.configs.minimal,
 // ...copilot.configs.recommended,
 // ...copilot.configs.strict,
 // ...copilot.configs.all,
];
```

## Rules

| Rule                                                                                                                                                                             | all | minimal | recommended | strict |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-----: | :---------: | :----: |
| [`no-blank-customization-body`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-customization-body)                                                       | ✅  |    —    |     ✅      |   ✅   |
| [`no-blank-repository-instructions`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-repository-instructions)                                             | ✅  |    —    |     ✅      |   ✅   |
| [`no-blank-skill-body`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-skill-body)                                                                       | ✅  |    —    |     ✅      |   ✅   |
| [`no-deprecated-agent-infer`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-deprecated-agent-infer)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`no-duplicate-agent-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-agent-names)                                                             | ✅  |    —    |     ✅      |   ✅   |
| [`no-duplicate-prompt-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-prompt-names)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`no-duplicate-skill-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-skill-names)                                                             | ✅  |    —    |     ✅      |   ✅   |
| [`no-duplicate-slash-command-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-slash-command-names)                                             | ✅  |    —    |     ✅      |   ✅   |
| [`no-empty-repository-hook-arrays`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-empty-repository-hook-arrays)                                               | ✅  |    —    |      —      |   ✅   |
| [`no-legacy-chatmode-files`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-legacy-chatmode-files)                                                             | ✅  |    —    |     ✅      |   ✅   |
| [`prefer-custom-instructions-under-code-review-limit`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-custom-instructions-under-code-review-limit)         | ✅  |    —    |      —      |   ✅   |
| [`prefer-fast-repository-hooks`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-fast-repository-hooks)                                                     | ✅  |    —    |      —      |   ✅   |
| [`prefer-qualified-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-qualified-tools)                                                                 | ✅  |    —    |      —      |   —    |
| [`require-agent-tool-for-subagents`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-agent-tool-for-subagents)                                             | ✅  |    —    |     ✅      |   ✅   |
| [`require-agents-md-for-cross-surface-agent-instructions`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-agents-md-for-cross-surface-agent-instructions) | ✅  |    —    |      —      |   ✅   |
| [`require-chatmode-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-chatmode-file-metadata)                                                 | ✅  |   ✅    |     ✅      |   ✅   |
| [`require-existing-agent-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-agent-hook-cwd)                                               | ✅  |    —    |      —      |   ✅   |
| [`require-existing-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-agent-mcp-servers)                                         | ✅  |    —    |      —      |   ✅   |
| [`require-existing-relative-agent-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-agent-links)                                   | ✅  |    —    |      —      |   ✅   |
| [`require-existing-relative-instructions-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-instructions-links)                     | ✅  |    —    |      —      |   ✅   |
| [`require-existing-relative-prompt-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-prompt-links)                                 | ✅  |    —    |      —      |   ✅   |
| [`require-existing-relative-skill-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-skill-links)                                   | ✅  |    —    |      —      |   ✅   |
| [`require-existing-repository-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-repository-hook-cwd)                                     | ✅  |    —    |      —      |   ✅   |
| [`require-github-copilot-target-for-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-github-copilot-target-for-mcp-servers)                   | ✅  |    —    |     ✅      |   ✅   |
| [`require-instructions-apply-to`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-instructions-apply-to)                                                   | ✅  |   ✅    |     ✅      |   ✅   |
| [`require-json-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-json-agent-mcp-servers)                                                 | ✅  |    —    |     ✅      |   ✅   |
| [`require-prompt-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-prompt-file-metadata)                                                     | ✅  |   ✅    |     ✅      |   ✅   |
| [`require-qualified-agent-handoff-models`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-qualified-agent-handoff-models)                                 | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-agent-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-agent-hook-cwd)                                               | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-agent-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-agent-links)                                                     | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-instructions-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-instructions-links)                                       | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-prompt-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-prompt-links)                                                   | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-repository-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-repository-hook-cwd)                                     | ✅  |    —    |     ✅      |   ✅   |
| [`require-relative-skill-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-skill-links)                                                     | ✅  |    —    |     ✅      |   ✅   |
| [`require-repository-hook-arrays`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hook-arrays)                                                 | ✅  |    —    |     ✅      |   ✅   |
| [`require-repository-hook-command-shell`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hook-command-shell)                                   | ✅  |    —    |     ✅      |   ✅   |
| [`require-repository-hooks-object`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hooks-object)                                               | ✅  |    —    |     ✅      |   ✅   |
| [`require-repository-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-instructions-file)                                     | ✅  |    —    |      —      |   ✅   |
| [`require-skill-file-location`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-file-location)                                                       | ✅  |    —    |     ✅      |   ✅   |
| [`require-skill-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-file-metadata)                                                       | ✅  |    —    |     ✅      |   ✅   |
| [`require-skill-md-filename`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-md-filename)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-skill-name-match-directory`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-name-match-directory)                                         | ✅  |    —    |      —      |   ✅   |
| [`require-string-repository-hook-env-values`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-string-repository-hook-env-values)                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-argument-hint`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-argument-hint)                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-handoff-send`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-handoff-send)                                             | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-handoffs`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-handoffs)                                                     | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-hook-events`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hook-events)                                               | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-hook-timeouts`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hook-timeouts)                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-hooks`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hooks)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-invocation-controls`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-invocation-controls)                               | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-mcp-servers)                                               | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-model`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-model)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-name)                                                             | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-subagents`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-subagents)                                                   | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-target`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-target)                                                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-agent-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-tools)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-instructions-apply-to-globs`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-instructions-apply-to-globs)                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-prompt-argument-hint`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-argument-hint)                                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-prompt-model`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-model)                                                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-prompt-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-name)                                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-prompt-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-tools)                                                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-repository-hook-command-type`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-command-type)                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-repository-hook-env`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-env)                                           | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-repository-hook-events`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-events)                                     | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-repository-hook-timeouts`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-timeouts)                                 | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-repository-hook-version`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-version)                                   | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-skill-directory-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-directory-name)                                         | ✅  |    —    |     ✅      |   ✅   |
| [`require-valid-skill-license`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-license)                                                       | ✅  |    —    |      —      |   ✅   |
| [`require-valid-skill-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-name)                                                             | ✅  |    —    |     ✅      |   ✅   |

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors.](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
