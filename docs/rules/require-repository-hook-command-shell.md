# require-repository-hook-command-shell

Require repository `command` hook definitions to declare at least one shell command under `bash` or `powershell`.

> **Rule catalog ID:** R061

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- `type: "command"` hook objects that omit both `bash` and `powershell`
- `command` hook objects whose shell command fields are blank

## Why this rule exists

A command hook without an executable shell command cannot do anything useful. Requiring at least one non-empty shell command catches incomplete hook definitions before they reach runtime.

## ❌ Incorrect

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command" }]
  }
}
```

## ✅ Correct

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "type": "command", "bash": "echo ready" }]
  }
}
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
