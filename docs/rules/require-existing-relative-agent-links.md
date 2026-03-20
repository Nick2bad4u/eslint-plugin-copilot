# require-existing-relative-agent-links

Require relative Markdown links in Copilot custom agents to resolve to existing workspace targets.

> **Rule catalog ID:** R031

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- relative custom-agent links whose resolved workspace target does not exist

## Why this rule exists

Custom agents often depend on linked checklists, architecture notes, and scripts. A relative link that points nowhere can make an agent look well-documented while silently depriving it of the referenced context.

## ❌ Incorrect

```md
---
description: Release coordinator
---
See [release runbook](../../docs/release-runbook.md).
```

when `../../docs/release-runbook.md` does not exist from the agent file.

## ✅ Correct

```md
---
description: Release coordinator
---
See [release runbook](../../docs/runbooks/release-runbook.md).
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
