# require-valid-agent-hooks

Require Copilot custom-agent hooks to use `type: command` and define at least one command property.

> **Rule catalog ID:** R014

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- hook entries whose `type` is missing or not `command`
- hook entries that do not define any of `command`, `windows`, `linux`, or `osx`

## Why this rule exists

Agent-scoped hooks in VS Code use the same structure as hook configuration files. The hook documentation states that each hook entry must have `type: "command"` and at least one command property. This rule catches incomplete agent-scoped hook entries before they silently fail or miscommunicate behavior.

## ❌ Incorrect

```md
---
description: Format files after editing
hooks:
  PostToolUse:
    - type: command
      cwd: scripts
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

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Docs: Agent hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
