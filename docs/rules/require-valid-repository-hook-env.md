# require-valid-repository-hook-env

Require repository hook `env` values to be JSON objects when present.

> **Rule catalog ID:** R065

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- `env` values that are arrays, numbers, strings, or other non-object JSON values

## Why this rule exists

Hook environment variables are documented as key/value mappings. Requiring an object shape keeps that contract explicit and prevents malformed environment configuration.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "env": ["LOG_LEVEL"] }]
  }
}
```

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "env": { "LOG_LEVEL": "info" } }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
