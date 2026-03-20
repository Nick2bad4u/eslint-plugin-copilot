# require-skill-file-location

Require project skill definition files to live at a documented `.github/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md` path.

> **Rule catalog ID:** R045

## Targeted pattern scope

- `**/SKILL.md`

## What this rule reports

- `SKILL.md` files that are not inside a documented project skill directory

## Why this rule exists

GitHub and compatible skill consumers expect project skills to live in a predictable directory structure. Keeping skill definitions in those documented locations makes discovery and portability much more reliable.

## ❌ Incorrect

```text
docs/SKILL.md
```

## ✅ Correct

```text
.github/skills/review-checklist/SKILL.md
```

## Further reading

- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
