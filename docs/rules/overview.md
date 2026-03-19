# Rule overview

`eslint-plugin-copilot` focuses on repository customization quality for GitHub Copilot.

## What the rules cover

- frontmatter metadata required by prompt, instructions, custom agent, and legacy chat mode files
- repository-wide instruction hygiene
- baseline repository setup when you opt into prompts, custom agents, legacy chat modes, agent instruction files, or path-specific instructions
- modern fully-qualified `tools` metadata in prompt, custom agent, and legacy chat mode files

## Design goals

- reflect documented GitHub Copilot and VS Code customization conventions
- keep rules static and predictable
- favor setup correctness over speculative content policing
- work directly on markdown-first Copilot asset files
