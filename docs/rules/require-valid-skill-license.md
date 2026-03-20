# require-valid-skill-license

Require optional Copilot skill `license` metadata to be a non-empty scalar when present.

> **Rule catalog ID:** R051

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- blank `license` values
- malformed non-scalar `license` values in supported frontmatter

## Why this rule exists

Some skills include explicit license metadata for reuse and sharing. If that field is present, it should contain a meaningful value rather than an empty placeholder.

## ❌ Incorrect

```md
---
name: review
description: Review code changes.
license:
---
Review code carefully.
```

## ✅ Correct

```md
---
name: review
description: Review code changes.
license: MIT
---
Review code carefully.
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
