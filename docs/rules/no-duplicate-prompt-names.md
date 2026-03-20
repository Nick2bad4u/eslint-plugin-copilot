# no-duplicate-prompt-names

Disallow duplicate effective prompt names across workspace prompt files.

> **Rule catalog ID:** R038

## Targeted pattern scope

- `.github/prompts/**/*.prompt.md`

## What this rule reports

- prompt files whose effective `name` collides with another prompt file in `.github/prompts`
- collisions involving explicit `name` frontmatter and filename-derived default names

## Why this rule exists

Prompt files share a slash-command namespace. Duplicate effective names make it ambiguous which prompt a caller intends to invoke and can create hard-to-diagnose behavior differences across tools.

## ❌ Incorrect

```text
.github/prompts/review.prompt.md
.github/prompts/other.prompt.md   # with frontmatter: name: review
```

## ✅ Correct

```text
.github/prompts/review.prompt.md
.github/prompts/other.prompt.md   # with frontmatter: name: review-security
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
