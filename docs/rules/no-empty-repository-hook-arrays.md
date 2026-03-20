# no-empty-repository-hook-arrays

Disallow empty repository hook arrays that opt into an event without any hook definitions.

> **Rule catalog ID:** R067

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook event arrays declared as `[]`

## Why this rule exists

An empty array says the repository opted into a hook event but did not actually configure any hooks. Removing empty event entries keeps the file focused on real behavior and makes the configuration easier to read.

## ❌ Incorrect

```json
{ "version": 1, "hooks": { "sessionStart": [] } }
```

## ✅ Correct

```json
{ "version": 1, "hooks": {} }
```

or:

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
