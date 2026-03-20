# require-existing-repository-hook-cwd

Require repository hook `cwd` values to resolve to existing repository paths.

> **Rule catalog ID:** R063

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- relative hook `cwd` values that do not exist in the repository

## Why this rule exists

A repository-relative working directory still needs to point somewhere real. Validating the path on disk catches stale or misspelled hook working directories before the hook runs.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "cwd": "scripts/hooks" }]
  }
}
```

when `scripts/hooks` does not exist in the repository.

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "cwd": "scripts" }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
