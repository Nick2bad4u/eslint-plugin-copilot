# require-skill-file-metadata

Require Copilot skill definition files to declare `name` and `description` frontmatter.

> **Rule catalog ID:** R046

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- skill files with no YAML frontmatter
- missing or blank `name` values
- missing or blank `description` values

## Why this rule exists

A skill definition without basic identifying metadata is hard for both humans and tools to understand. `name` and `description` provide the minimal contract that explains what the skill is and when it should be used.

## ❌ Incorrect

```md
Review code carefully and use the security checklist.
```

## ✅ Correct

```md
---
name: review-checklist
description: Review code changes with the repository checklist.
---
Review code carefully and use the security checklist.
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
