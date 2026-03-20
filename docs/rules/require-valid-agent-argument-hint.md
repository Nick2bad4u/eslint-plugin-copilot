# require-valid-agent-argument-hint

Require Copilot custom-agent `argument-hint` metadata to be a non-empty scalar when present.

> **Rule catalog ID:** R043

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- blank custom-agent `argument-hint` values
- malformed non-scalar `argument-hint` values in supported frontmatter

## Why this rule exists

A custom agent's `argument-hint` is supposed to help callers understand what to pass when invoking the agent. If that field is present, it should contain usable guidance rather than an empty placeholder.

## ❌ Incorrect

```md
---
description: Investigate a bug
argument-hint:
---
Investigate the supplied issue.
```

## ✅ Correct

```md
---
description: Investigate a bug
argument-hint: <issue-url-or-stack-trace>
---
Investigate the supplied issue.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
