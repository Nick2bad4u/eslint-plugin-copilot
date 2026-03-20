# prefer-fast-repository-hooks

Prefer repository hooks to stay at or below the default 30-second timeout unless a slower hook is truly necessary.

> **Rule catalog ID:** R068

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook `timeoutSec` values greater than the documented default 30-second timeout budget

## Why this rule exists

Long-running hooks slow down agent workflows and increase the chance of timeouts or poor user experience. Keeping hooks within the default budget encourages lightweight, reliable automation.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready", "timeoutSec": 120 }]
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
