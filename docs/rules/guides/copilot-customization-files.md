# Copilot customization files

GitHub Copilot repository customization spans these markdown-first surfaces:

- repository instructions
- path-specific instructions
- prompt files
- custom agents
- legacy chat modes
- agent instruction files
- skill definition files

It also includes repository hook configuration files under `.github/hooks/*.json`.

This plugin intentionally keeps its first rule set focused on structural correctness and metadata quality for those files.

That includes modern custom-agent details such as deprecated frontmatter cleanup, subagent/tool wiring checks, valid subagent allow-list metadata, valid invocation-control flags, valid target values, valid `tools` list metadata, valid `mcp-servers` list metadata, handoff metadata integrity, valid handoff send values, qualified handoff model names, valid model override metadata, valid agent-scoped hook commands, supported hook event names, numeric hook timeouts, repository-relative hook working directories, GitHub-target-specific agent metadata, prompt-body relative-link checks, valid prompt-model metadata, prompt and agent naming hygiene, skill location and frontmatter requirements, skill naming and link rules, repository hook JSON schema validation, repository hook path and environment checks, body-content quality checks, and migration guidance away from legacy chatmode files, not just basic required metadata.
