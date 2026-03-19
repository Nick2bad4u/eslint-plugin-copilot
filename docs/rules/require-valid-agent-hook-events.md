# require-valid-agent-hook-events

Require Copilot custom-agent hooks to use supported VS Code hook event names.

> **Rule catalog ID:** R015

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- agent-scoped hook event names that are not one of the supported VS Code lifecycle events

## Why this rule exists

VS Code agent hooks only support a defined set of lifecycle event names: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`, `SubagentStart`, `SubagentStop`, and `Stop`. Using a different event name makes the hook configuration drift away from the documented contract.

## ❌ Incorrect

```md
---
description: Format files after editing
hooks:
  AfterEdit:
    - type: command
      command: ./scripts/format.sh
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
---
Format edited files after tool usage.
```

## Further reading

- [VS Code Docs: Agent hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
