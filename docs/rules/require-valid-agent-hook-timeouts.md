# require-valid-agent-hook-timeouts

Require Copilot custom-agent hook `timeout` values to be numeric seconds when present.

> **Rule catalog ID:** R016

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- agent-scoped hook entries whose `timeout` value is present but not numeric

## Why this rule exists

VS Code hook documentation defines `timeout` as a numeric value in seconds. Keeping hook timeout metadata numeric avoids ambiguous strings and keeps custom-agent hook frontmatter aligned with the documented hook command format.

## ❌ Incorrect

```md
---
description: Format files after editing
hooks:
  PostToolUse:
    - type: command
      command: ./scripts/format.sh
      timeout: soon
---
Format edited files after tool usage.
```

## ✅ Correct

```md
---
description: Format files after editing
hooks:
  PostToolUse:
    - type: command
      command: ./scripts/format.sh
      timeout: 15
---
Format edited files after tool usage.
```

## Further reading

- [VS Code Docs: Agent hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
