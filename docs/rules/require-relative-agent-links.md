# require-relative-agent-links

Require Copilot custom agents to use relative Markdown links for workspace files.

> **Rule catalog ID:** R028

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- root-relative links such as `/docs/runbook.md`
- file links that use other non-relative workspace-style paths instead of paths relative to the current agent file

## Why this rule exists

Relative links make custom-agent instructions portable across forks, local clones, and different workspace roots. They also match how Copilot customization content typically references repository resources.

## ❌ Incorrect

```md
---
description: Release coordinator
---
See [runbook](/docs/release-runbook.md).
```

## ✅ Correct

```md
---
description: Release coordinator
---
See [runbook](../../docs/release-runbook.md).
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
