# require-valid-agent-tools

Require Copilot custom-agent `tools` metadata to be a non-empty list of tool or tool-set names when present.

> **Rule catalog ID:** R025

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- empty custom-agent `tools` values
- scalar custom-agent `tools` values instead of the documented list form
- empty custom-agent `tools` lists such as `[]`

## Why this rule exists

VS Code documents custom-agent `tools` as a list of tool or tool set names. Keeping that metadata in the documented list shape helps ensure a custom agent's allowed tool surface is explicit and machine-usable.

## ❌ Incorrect

```md
---
description: Review implementation quality
tools: search/codebase
---
Review the implementation carefully.
```

## ✅ Correct

```md
---
description: Review implementation quality
tools: ['search/codebase', 'fetch/web']
---
Review the implementation carefully.
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
