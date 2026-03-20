# no-blank-skill-body

Disallow blank Copilot skill definition bodies.

> **Rule catalog ID:** R047

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- skill files whose Markdown body is empty after frontmatter

## Why this rule exists

A skill without any instructions, examples, or guidance provides almost no value. The frontmatter can identify the skill, but the body is where the actual reusable task knowledge lives.

## ❌ Incorrect

```md
---
name: review-checklist
description: Review code changes with the repository checklist.
---
```

## ✅ Correct

```md
---
name: review-checklist
description: Review code changes with the repository checklist.
---
Follow the review checklist, call out risk areas, and summarize required follow-up work.
```

## Further reading

- [GitHub Docs: About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
