# require-relative-agent-hook-cwd

Require Copilot custom-agent hook `cwd` values to stay relative to the repository root.

> **Rule catalog ID:** R018

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- agent-scoped hook entries whose `cwd` value is empty
- agent-scoped hook entries whose `cwd` value is absolute, home-relative, or otherwise not repository-relative

## Why this rule exists

VS Code documents hook `cwd` as a working directory path relative to the repository root. Absolute paths and empty values make hook execution less portable across developers and environments, and they drift away from the documented hook configuration format.

## ❌ Incorrect

```md
---
description: Format files after editing
hooks:
  PostToolUse:
    - type: command
      command: ./scripts/format.sh
      cwd: C:\hooks
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
      cwd: scripts/hooks
---
Format edited files after tool usage.
```

## Further reading

- [VS Code Docs: Agent hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
