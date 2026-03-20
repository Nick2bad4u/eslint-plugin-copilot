# no-duplicate-agent-names

Disallow duplicate effective custom-agent names across workspace custom-agent files.

> **Rule catalog ID:** R039

## Targeted pattern scope

- `.github/agents/**/*.agent.md`

## What this rule reports

- agent files whose effective `name` collides with another agent file in `.github/agents`
- collisions involving explicit `name` frontmatter and filename-derived default names

## Why this rule exists

Custom agents are easier to select and reason about when each one has a unique effective name. Duplicate names make agent routing and documentation more confusing than necessary.

## ❌ Incorrect

```text
.github/agents/reviewer.agent.md
.github/agents/other.agent.md   # with frontmatter: name: reviewer
```

## ✅ Correct

```text
.github/agents/reviewer.agent.md
.github/agents/other.agent.md   # with frontmatter: name: reviewer-security
```

## Further reading

- [VS Code Docs: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
