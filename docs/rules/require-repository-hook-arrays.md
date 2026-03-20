# require-repository-hook-arrays

Require each repository hook event entry in `hooks` to be an array.

> **Rule catalog ID:** R058

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook event values that are objects, strings, numbers, or other non-array JSON values

## Why this rule exists

Each hook event is documented as an array of hook definitions. Enforcing that array shape keeps the JSON structure consistent and makes it possible to reason about multiple hooks on the same event.

## ❌ Incorrect

```json
{ "version": 1, "hooks": { "sessionStart": {} } }
```

## ✅ Correct

```json
{ "version": 1, "hooks": { "sessionStart": [] } }
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
