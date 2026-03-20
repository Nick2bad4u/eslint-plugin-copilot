# Rule overview

`eslint-plugin-copilot` focuses on repository customization quality for GitHub Copilot.

## What the rules cover

- required frontmatter metadata for prompt, instructions, custom-agent, chatmode, and skill definition files
- non-empty, correctly shaped optional metadata such as prompt and agent `name`, `argument-hint`, `tools`, `model`, and skill `license`
- repository-relative `applyTo` glob validation for path-specific instructions
- practical repository-instructions guidance such as the code-review 4,000-character budget
- baseline repository setup when you opt into prompts, custom agents, chat modes, skills, agent instruction files, or path-specific instructions
- duplicate effective names across prompts, custom agents, skills, and shared slash-command namespaces
- relative-link and existing-target checks for prompts, instructions, agents, and skills
- modern custom-agent-only metadata such as subagent wiring, invocation controls, targets, MCP servers, hooks, and handoffs
- GitHub-target-specific custom-agent metadata such as `mcp-servers` targeting and JSON config references
- repository-relative and existing-path validation for agent hook `cwd` values
- repository hook JSON schema quality under `.github/hooks/*.json`, including `version`, `hooks`, event arrays, hook `type`, shell commands, `cwd`, `timeoutSec`, and `env`
- repository hook maintainability checks such as avoiding empty event arrays and oversized timeout budgets
- migration pressure away from legacy `.chatmode.md` customization files toward modern `.agent.md` agents
- modern fully-qualified `tools` metadata in prompt, custom agent, and legacy chat mode files

## Design goals

- reflect documented GitHub Copilot and VS Code customization conventions
- keep rules static and predictable
- favor setup correctness over speculative content policing
- work directly on markdown-first Copilot asset files plus repository hook JSON
