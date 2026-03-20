# require-valid-repository-hook-version

Require repository hook configuration files to declare `version: 1`.

> **Rule catalog ID:** R056

## Targeted pattern scope

- `.github/hooks/**/*.json`

## What this rule reports

- hook configuration files with a missing `version`
- hook configuration files whose `version` is not exactly `1`

## Why this rule exists

Repository hook files use an explicit versioned JSON schema. Requiring the documented `version: 1` value catches incompatible or incomplete hook files early.

## ❌ Incorrect

```json
{ "version": 2, "hooks": {} }
```

## ✅ Correct

```json
{ "version": 1, "hooks": {} }
```

## Further reading

- [GitHub Docs: Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks)
