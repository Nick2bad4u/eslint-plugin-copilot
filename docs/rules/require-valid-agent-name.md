# require-valid-agent-name

Require Copilot custom-agent `name` metadata to be a non-empty scalar when present.

> **Rule catalog ID:** R042

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- blank custom-agent `name` values
- malformed non-scalar `name` values in supported frontmatter

## Why this rule exists

Custom agents can declare a friendly `name` in frontmatter. When present, that field should be an actual scalar string so the agent has a stable human-facing identity instead of an empty placeholder.

## ❌ Incorrect

```md
---
description: Review implementation quality
name:
---
Review the implementation carefully.
```

## ✅ Correct

```md
---
description: Review implementation quality
name: reviewer
---
Review the implementation carefully.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
