# require-repository-hooks-object

Require repository hook configuration files to declare a top-level `hooks` object.

> **Rule catalog ID:** R057

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook configuration files with a missing top-level `hooks` object
- hook configuration files whose `hooks` value is not a JSON object

## Why this rule exists

The hook schema centers on a top-level `hooks` object keyed by event name. Without that object, the file cannot declare event-specific hook arrays in the documented structure.

## ❌ Incorrect

```json
{ "version": 1 }
```

## ✅ Correct

```json
{ "version": 1, "hooks": {} }
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
