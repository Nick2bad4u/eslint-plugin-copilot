# require-valid-repository-hook-timeouts

Require repository hook `timeoutSec` values to be positive integers when present.

> **Rule catalog ID:** R064

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- zero, negative, fractional, or non-numeric `timeoutSec` values

## Why this rule exists

Hook timeouts are numeric execution budgets. Requiring a positive integer keeps the hook configuration aligned with the documented schema and avoids values that are ambiguous or unusable at runtime.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "timeoutSec": 0 }]
  }
}
```

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "timeoutSec": 10 }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
