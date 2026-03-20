# require-relative-skill-links

Require Copilot skill definition files to use relative Markdown links for workspace resources.

> **Rule catalog ID:** R052

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- root-relative or otherwise non-relative workspace file links in a skill body

## Why this rule exists

Skills frequently reference supplementary Markdown files, scripts, and local resources. Relative links keep those references portable and aligned with the repository-local nature of project skills.

## ❌ Incorrect

```md
---
name: review
description: Review code changes.
---
See [guide](/docs/review.md).
```

## ✅ Correct

```md
---
name: review
description: Review code changes.
---
See [guide](guide.md).
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
