# no-duplicate-skill-names

Disallow duplicate effective skill names across project skill definition files.

> **Rule catalog ID:** R054

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- skill definitions with duplicate effective names across `.github/skills` and `.claude/skills`
- collisions involving explicit frontmatter names and directory-derived default names

## Why this rule exists

Duplicate skill names make it harder to understand which skill a repository intends to expose for a given task. Keeping skill names unique also avoids confusion when skills are documented or referenced externally.

## ❌ Incorrect

```text
.github/skills/review/SKILL.md
.claude/skills/review-clone/SKILL.md   # with frontmatter: name: review
```

## ✅ Correct

```text
.github/skills/review/SKILL.md
.claude/skills/review-clone/SKILL.md   # with frontmatter: name: review-clone
```

## Further reading

- [GitHub Docs: About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
