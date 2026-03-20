# require-valid-skill-directory-name

Require Copilot skill directory names to use the documented lowercase-hyphen form.

> **Rule catalog ID:** R049

## Targeted pattern scope

- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- skill directory names that use spaces, uppercase letters, or other unsupported characters

## Why this rule exists

Skill directories are part of the documented skill layout. Keeping those directory names lowercase and hyphenated makes the on-disk structure match published guidance and avoids path portability issues.

## ❌ Incorrect

```text
.github/skills/Review Skill/SKILL.md
```

## ✅ Correct

```text
.github/skills/review-skill/SKILL.md
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
