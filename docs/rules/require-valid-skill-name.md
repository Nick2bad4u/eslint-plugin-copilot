# require-valid-skill-name

Require Copilot skill `name` metadata to use the documented lowercase-hyphen identifier form.

> **Rule catalog ID:** R048

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- skill `name` values that use spaces, uppercase letters, or other unsupported characters
- blank skill `name` values when the field is present

## Why this rule exists

GitHub documents lowercase, hyphen-separated skill identifiers. Following that convention keeps skill names consistent with directory names and avoids ambiguous command-like identifiers.

## ❌ Incorrect

```md
---
name: Review Skill
description: Review code changes.
---
Review code carefully.
```

## ✅ Correct

```md
---
name: review-skill
description: Review code changes.
---
Review code carefully.
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
