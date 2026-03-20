# require-existing-relative-skill-links

Require relative Markdown links in Copilot skill definition files to resolve to existing workspace resources.

> **Rule catalog ID:** R053

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- relative skill links whose resolved workspace target does not exist

## Why this rule exists

Skills often depend on linked guides, examples, and scripts stored alongside the definition. Broken relative links make the skill incomplete even though its frontmatter and body appear structurally valid.

## ❌ Incorrect

```md
---
name: review
description: Review code changes.
---
See [guide](guide.md).
```

when `guide.md` does not exist next to the skill definition.

## ✅ Correct

```md
---
name: review
description: Review code changes.
---
See [guide](reference/guide.md).
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
