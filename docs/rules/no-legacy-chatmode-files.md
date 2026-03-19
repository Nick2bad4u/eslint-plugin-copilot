# no-legacy-chatmode-files

Disallow legacy Copilot `.chatmode.md` files in favor of modern `.agent.md` custom agents.

> **Rule catalog ID:** R011

## Targeted pattern scope

- `.github/chatmodes/**/*.chatmode.md`

## What this rule reports

- legacy workspace chat mode files that still use the old `.chatmode.md` naming and location

## Why this rule exists

VS Code custom agents replaced legacy chat modes. The current documentation recommends migrating older `.chatmode.md` files to `.agent.md` files under `.github/agents/` so repositories use the modern Copilot customization surface.

Keeping legacy chat mode files around makes repository customization harder to standardize and pushes teams toward an older contract that VS Code now documents as migrated terminology.

## ❌ Incorrect

```md
---
description: Plan work carefully
---
Plan the requested change before implementation.
```

Saved as:

```text
.github/chatmodes/planner.chatmode.md
```

## ✅ Correct

```md
---
description: Plan work carefully
---
Plan the requested change before implementation.
```

Saved as:

```text
.github/agents/planner.agent.md
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
