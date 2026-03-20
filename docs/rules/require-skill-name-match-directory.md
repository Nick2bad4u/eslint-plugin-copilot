# require-skill-name-match-directory

Require Copilot skill `name` metadata to match the skill directory name.

> **Rule catalog ID:** R050

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- explicit skill `name` values that do not match the parent skill directory name

## Why this rule exists

A mismatch between the skill directory and the declared skill name makes repositories harder to navigate and increases the chance that links, docs, or user expectations refer to the wrong identifier.

## ❌ Incorrect

```text
.github/skills/review/SKILL.md
```

with frontmatter:

```md
---
name: review-security
description: Review code changes.
---
```

## ✅ Correct

```md
---
name: review
description: Review code changes.
---
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
