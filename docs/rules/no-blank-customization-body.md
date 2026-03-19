# no-blank-customization-body

Disallow blank bodies in Copilot customization files other than repository-wide instructions.

> **Rule catalog ID:** R009

## Targeted pattern scope

- `.github/instructions/**/*.instructions.md`
- `.github/prompts/**/*.prompt.md`
- `.github/agents/**/*.agent.md`
- `.github/chatmodes/**/*.chatmode.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## What this rule reports

- Copilot customization files whose body is empty after ignoring frontmatter, whitespace, and HTML comments
- files that only contain metadata without any meaningful Markdown instructions in the document body

## Why this rule exists

Copilot customization files are instruction surfaces. A prompt, custom agent, or path-specific instructions file that only contains frontmatter does not give Copilot any actual guidance to apply. This rule catches metadata-only files before they silently become ineffective customization points.

Repository-wide `.github/copilot-instructions.md` is intentionally excluded because it already has a dedicated blank-content rule.

## ❌ Incorrect

```md
---
description: Review the repository
agent: ask
---
<!-- no actual prompt body -->
```

## ✅ Correct

```md
---
description: Review the repository
agent: ask
---
Review the repository for configuration drift and summarize the biggest risks first.
```

## Further reading

- [VS Code Docs: Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Docs: Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
