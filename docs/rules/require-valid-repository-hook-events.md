# require-valid-repository-hook-events

Require repository hook configuration files to use supported hook event names.

> **Rule catalog ID:** R059

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- unsupported hook event names inside the top-level `hooks` object

## Why this rule exists

Repository hooks only run for a fixed set of documented lifecycle events. Rejecting unknown event names helps catch typos and prevents configuration from silently doing nothing.

## ❌ Incorrect

```json
{ "version": 1, "hooks": { "beforeAnything": [] } }
```

## ✅ Correct

```json
{ "version": 1, "hooks": { "sessionStart": [] } }
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
- [GitHub Docs: GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
