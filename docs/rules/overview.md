# Rule overview

`eslint-plugin-copilot` focuses on repository customization quality for GitHub Copilot.

## What the rules cover

- frontmatter metadata required by prompt, instructions, custom agent, and legacy chat mode files
- modern custom-agent-only metadata such as subagent wiring and deprecated agent frontmatter
- documented custom-agent invocation and target controls
- meaningful body content in prompt, instructions, agent-instructions, and custom agent files
- GitHub Copilot-specific custom-agent metadata such as `mcp-servers` targeting
- guided handoff metadata integrity for custom-agent workflows
- valid custom-agent handoff send metadata
- qualified handoff model names for explicit model routing
- valid custom-agent subagent allow-list metadata
- valid custom-agent invocation-control flags
- valid custom-agent `mcp-servers` list metadata
- valid custom-agent model override metadata
- valid custom-agent tools-list metadata
- valid custom-agent target values
- valid agent-scoped hook command entries
- supported agent-scoped hook lifecycle event names
- numeric agent-scoped hook timeout metadata
- repository-relative agent-scoped hook working directories
- relative workspace-file links inside prompt bodies
- valid prompt-file model override metadata
- repository-wide instruction hygiene
- baseline repository setup when you opt into prompts, custom agents, legacy chat modes, agent instruction files, or path-specific instructions
- migration pressure away from legacy `.chatmode.md` customization files toward modern `.agent.md` agents
- modern fully-qualified `tools` metadata in prompt, custom agent, and legacy chat mode files

## Design goals

- reflect documented GitHub Copilot and VS Code customization conventions
- keep rules static and predictable
- favor setup correctness over speculative content policing
- work directly on markdown-first Copilot asset files
