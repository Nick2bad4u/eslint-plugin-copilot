# require-relative-repository-hook-cwd

Require repository hook `cwd` values to use repository-relative paths.

> **Rule catalog ID:** R062

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- absolute or otherwise non-relative `cwd` values in hook definitions

## Why this rule exists

Repository hooks are meant to run against the checked-out repository. Repository-relative working directories are more portable than absolute paths and avoid machine-specific configuration.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "cwd": "/tmp" }]
  }
}
```

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
