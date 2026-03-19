# Rule overview

`eslint-plugin-copilot` focuses on repository customization quality for GitHub Copilot.

## What the rules cover

- frontmatter metadata required by prompt, instructions, and chat mode files
- repository-wide instruction hygiene
- baseline repository setup when you opt into prompts, chat modes, agent files, or path-specific instructions
- modern fully-qualified `tools` metadata in prompt and chat mode files

## Design goals

- reflect documented GitHub Copilot and VS Code customization conventions
- keep rules static and predictable
- favor setup correctness over speculative content policing
- work directly on markdown-first Copilot asset files
