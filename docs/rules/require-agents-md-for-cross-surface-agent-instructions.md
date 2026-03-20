# require-agents-md-for-cross-surface-agent-instructions

Require `CLAUDE.md` and `GEMINI.md` agent-instructions files to be paired with a sibling `AGENTS.md` for broader cross-surface support.

> **Rule catalog ID:** R037

## Targeted pattern scope

- `**/CLAUDE.md`
- `**/GEMINI.md`

## What this rule reports

- `CLAUDE.md` files that do not have a same-directory `AGENTS.md`
- `GEMINI.md` files that do not have a same-directory `AGENTS.md`

## Why this rule exists

Some instruction filenames are specific to particular tools or surfaces, while `AGENTS.md` has broader reach across Copilot-related agent experiences. Pairing surface-specific instruction files with `AGENTS.md` helps keep critical guidance available in more places.

## ❌ Incorrect

```text
docs/
  CLAUDE.md
```

## ✅ Correct

```text
docs/
  AGENTS.md
  CLAUDE.md
```

## Further reading

- [GitHub Docs: Add repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [VS Code Docs: Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
