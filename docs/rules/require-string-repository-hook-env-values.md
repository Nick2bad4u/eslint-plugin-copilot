# require-string-repository-hook-env-values

Require repository hook `env` objects to use string values.

> **Rule catalog ID:** R066

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- `env` objects that contain non-string values such as numbers, arrays, or nested objects

## Why this rule exists

Environment variables are string-based in practice. Requiring string values avoids surprising serialization behavior and keeps hook environment configuration aligned with how shells consume variables.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "env": { "RETRIES": 3 } }]
  }
}
```

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "env": { "RETRIES": "3" } }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
