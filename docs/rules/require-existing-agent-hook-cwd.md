# require-existing-agent-hook-cwd

Require Copilot custom-agent hook `cwd` entries to resolve to existing repository directories.

> **Rule catalog ID:** R035

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- relative hook `cwd` values that do not resolve to an existing repository path

## Why this rule exists

A hook working directory should point at a real location in the repository. If it does not, the hook may fail as soon as Copilot tries to execute it, even though the frontmatter appears valid at first glance.

## ❌ Incorrect

```md
---
description: Review coordinator
hooks:
  SessionStart:
    - type: command
      command: echo ready
      cwd: scripts/review
---
Review the implementation.
```

when `scripts/review` does not exist in the repository.

## ✅ Correct

```md
---
description: Review coordinator
hooks:
  SessionStart:
    - type: command
      command: echo ready
      cwd: scripts
---
Review the implementation.
```

## Further reading

- [VS Code Docs: Agent hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
