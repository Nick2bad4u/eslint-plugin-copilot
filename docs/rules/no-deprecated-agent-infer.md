# no-deprecated-agent-infer

Disallow deprecated `infer` frontmatter in Copilot custom agent files.

> **Rule catalog ID:** R007

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- custom agent files that still declare deprecated `infer` frontmatter

## Why this rule exists

VS Code custom agents now use `user-invocable` and `disable-model-invocation` for picker visibility and subagent invocation control. Keeping deprecated `infer` metadata around makes agent behavior less explicit and drifts away from the current contract.

## ❌ Incorrect

```md
---
description: Hidden implementation helper
infer: false
---
Implement changes based on the approved plan.
```

## ✅ Correct

```md
---
description: Hidden implementation helper
user-invocable: false
disable-model-invocation: false
---
Implement changes based on the approved plan.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
