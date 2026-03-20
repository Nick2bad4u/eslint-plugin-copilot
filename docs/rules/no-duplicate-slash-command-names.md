# no-duplicate-slash-command-names

Disallow duplicate slash-command names across prompt files and skills.

> **Rule catalog ID:** R069

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`
- `.github/skills/**/SKILL.md`
- `.claude/skills/**/SKILL.md`

## What this rule reports

- prompt names that collide with skill names
- skill names that collide with prompt names
- collisions involving explicit frontmatter names and default filename or directory-derived names

## Why this rule exists

Prompt files and skills both participate in slash-command style invocation flows. Reusing the same effective command name across those surfaces creates namespace collisions and makes command selection ambiguous.

## ❌ Incorrect

```text
.github/prompts/review.prompt.md   # effective name: review
.github/skills/review/SKILL.md     # effective name: review
```

## ✅ Correct

```text
.github/prompts/review.prompt.md         # effective name: review
.github/skills/review-checklist/SKILL.md # effective name: review-checklist
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [GitHub Docs: Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)
