# require-valid-repository-hook-command-type

Require repository hook definitions to declare a supported `type` value such as `command` or `prompt`.

> **Rule catalog ID:** R060

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook objects with a missing `type`
- hook objects whose `type` is not a supported string

## Why this rule exists

Each hook definition needs an explicit type so Copilot knows how to interpret it. Requiring a supported `type` catches incomplete hook entries and obvious schema mismatches.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "bash": "echo ready" }]
  }
}
```

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready" }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
- [GitHub Docs: GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
