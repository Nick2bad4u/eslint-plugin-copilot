# require-skill-md-filename

Require markdown files that declare skill-definition frontmatter to use the documented `SKILL.md` filename.

> **Rule catalog ID:** R055

## Targeted pattern scope

- `.github/skills/**/*.md`
- `.claude/skills/**/*.md`

## What this rule reports

- markdown files inside skill directories that look like skill definitions but are not named `SKILL.md`

## Why this rule exists

Supplementary Markdown files are allowed inside a skill directory, but the actual skill definition file has a special documented filename. Enforcing that distinction keeps discovery predictable while still allowing supporting docs next to the skill.

## ❌ Incorrect

```text
.github/skills/review/README.md
```

with frontmatter such as:

```md
---
name: review
description: Review code changes.
---
```

## ✅ Correct

```text
.github/skills/review/SKILL.md
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
