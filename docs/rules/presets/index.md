# Presets

`eslint-plugin-copilot` ships four flat-config presets.

## Rule matrix

| Rule | all | minimal | recommended | strict |
| --- | :-: | :-: | :-: | :-: |
| [`no-blank-customization-body`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-customization-body) | ✅ | — | ✅ | ✅ |
| [`no-blank-repository-instructions`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-repository-instructions) | ✅ | — | ✅ | ✅ |
| [`no-blank-skill-body`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-blank-skill-body) | ✅ | — | ✅ | ✅ |
| [`no-deprecated-agent-infer`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-deprecated-agent-infer) | ✅ | — | ✅ | ✅ |
| [`no-duplicate-agent-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-agent-names) | ✅ | — | ✅ | ✅ |
| [`no-duplicate-prompt-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-prompt-names) | ✅ | — | ✅ | ✅ |
| [`no-duplicate-skill-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-skill-names) | ✅ | — | ✅ | ✅ |
| [`no-duplicate-slash-command-names`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-duplicate-slash-command-names) | ✅ | — | ✅ | ✅ |
| [`no-empty-repository-hook-arrays`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-empty-repository-hook-arrays) | ✅ | — | — | ✅ |
| [`no-legacy-chatmode-files`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/no-legacy-chatmode-files) | ✅ | — | ✅ | ✅ |
| [`prefer-custom-instructions-under-code-review-limit`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-custom-instructions-under-code-review-limit) | ✅ | — | — | ✅ |
| [`prefer-fast-repository-hooks`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-fast-repository-hooks) | ✅ | — | — | ✅ |
| [`prefer-qualified-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/prefer-qualified-tools) | ✅ | — | — | — |
| [`require-agent-tool-for-subagents`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-agent-tool-for-subagents) | ✅ | — | ✅ | ✅ |
| [`require-agents-md-for-cross-surface-agent-instructions`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-agents-md-for-cross-surface-agent-instructions) | ✅ | — | — | ✅ |
| [`require-chatmode-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-chatmode-file-metadata) | ✅ | ✅ | ✅ | ✅ |
| [`require-existing-agent-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-agent-hook-cwd) | ✅ | — | — | ✅ |
| [`require-existing-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-agent-mcp-servers) | ✅ | — | — | ✅ |
| [`require-existing-relative-agent-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-agent-links) | ✅ | — | — | ✅ |
| [`require-existing-relative-instructions-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-instructions-links) | ✅ | — | — | ✅ |
| [`require-existing-relative-prompt-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-prompt-links) | ✅ | — | — | ✅ |
| [`require-existing-relative-skill-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-relative-skill-links) | ✅ | — | — | ✅ |
| [`require-existing-repository-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-existing-repository-hook-cwd) | ✅ | — | — | ✅ |
| [`require-github-copilot-target-for-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-github-copilot-target-for-mcp-servers) | ✅ | — | ✅ | ✅ |
| [`require-instructions-apply-to`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-instructions-apply-to) | ✅ | ✅ | ✅ | ✅ |
| [`require-json-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-json-agent-mcp-servers) | ✅ | — | ✅ | ✅ |
| [`require-prompt-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-prompt-file-metadata) | ✅ | ✅ | ✅ | ✅ |
| [`require-qualified-agent-handoff-models`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-qualified-agent-handoff-models) | ✅ | — | ✅ | ✅ |
| [`require-relative-agent-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-agent-hook-cwd) | ✅ | — | ✅ | ✅ |
| [`require-relative-agent-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-agent-links) | ✅ | — | ✅ | ✅ |
| [`require-relative-instructions-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-instructions-links) | ✅ | — | ✅ | ✅ |
| [`require-relative-prompt-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-prompt-links) | ✅ | — | ✅ | ✅ |
| [`require-relative-repository-hook-cwd`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-repository-hook-cwd) | ✅ | — | ✅ | ✅ |
| [`require-relative-skill-links`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-relative-skill-links) | ✅ | — | ✅ | ✅ |
| [`require-repository-hook-arrays`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hook-arrays) | ✅ | — | ✅ | ✅ |
| [`require-repository-hook-command-shell`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hook-command-shell) | ✅ | — | ✅ | ✅ |
| [`require-repository-hooks-object`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-hooks-object) | ✅ | — | ✅ | ✅ |
| [`require-repository-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-repository-instructions-file) | ✅ | — | — | ✅ |
| [`require-skill-file-location`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-file-location) | ✅ | — | ✅ | ✅ |
| [`require-skill-file-metadata`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-file-metadata) | ✅ | — | ✅ | ✅ |
| [`require-skill-md-filename`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-md-filename) | ✅ | — | ✅ | ✅ |
| [`require-skill-name-match-directory`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-skill-name-match-directory) | ✅ | — | — | ✅ |
| [`require-string-repository-hook-env-values`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-string-repository-hook-env-values) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-argument-hint`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-argument-hint) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-handoff-send`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-handoff-send) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-handoffs`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-handoffs) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-hook-events`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hook-events) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-hook-timeouts`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hook-timeouts) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-hooks`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-hooks) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-invocation-controls`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-invocation-controls) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-mcp-servers`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-mcp-servers) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-model`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-model) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-name) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-subagents`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-subagents) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-target`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-target) | ✅ | — | ✅ | ✅ |
| [`require-valid-agent-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-agent-tools) | ✅ | — | ✅ | ✅ |
| [`require-valid-instructions-apply-to-globs`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-instructions-apply-to-globs) | ✅ | — | ✅ | ✅ |
| [`require-valid-prompt-argument-hint`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-argument-hint) | ✅ | — | ✅ | ✅ |
| [`require-valid-prompt-model`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-model) | ✅ | — | ✅ | ✅ |
| [`require-valid-prompt-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-name) | ✅ | — | ✅ | ✅ |
| [`require-valid-prompt-tools`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-prompt-tools) | ✅ | — | ✅ | ✅ |
| [`require-valid-repository-hook-command-type`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-command-type) | ✅ | — | ✅ | ✅ |
| [`require-valid-repository-hook-env`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-env) | ✅ | — | ✅ | ✅ |
| [`require-valid-repository-hook-events`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-events) | ✅ | — | ✅ | ✅ |
| [`require-valid-repository-hook-timeouts`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-timeouts) | ✅ | — | ✅ | ✅ |
| [`require-valid-repository-hook-version`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-repository-hook-version) | ✅ | — | ✅ | ✅ |
| [`require-valid-skill-directory-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-directory-name) | ✅ | — | ✅ | ✅ |
| [`require-valid-skill-license`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-license) | ✅ | — | — | ✅ |
| [`require-valid-skill-name`](https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/require-valid-skill-name) | ✅ | — | ✅ | ✅ |

