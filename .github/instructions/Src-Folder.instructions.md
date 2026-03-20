---
name: "Copilot-Instructions-ESLint-Plugin-Source"
description: "Authoring rules and source modules in the ESLint plugin template under src/."
applyTo: "src/**"
---

<instructions>
## Goal in `src/`

- Treat `src/` as the source of truth for runtime behavior, shared helpers, rules, and preset wiring.
- Change source modules here instead of patching generated output or copied docs.

## Layout

- `src/plugin.ts`: public plugin surface and preset exports.
- `src/rules/*.ts`: one rule per file; default export should be the rule module.
- `src/_internal/**`: shared helpers, metadata utilities, and non-public internals.

## Rule-authoring expectations

- Follow the repo's shared rule-creator pattern.
- Keep authored metadata static and explicit.
- Use precise `meta.schema`, stable `messageId`s, and the correct `meta.type`.
- Mark `requiresTypeChecking`, `deprecated`, and `frozen` accurately.
- Reuse shared helpers instead of duplicating analysis or fixer logic.

## Workflow for new rules

1. Add the rule source.
2. Register it in runtime/catalog surfaces.
3. Add docs and tests.
4. Update preset and README/docs sync outputs.
5. Revalidate plugin exports and related public metadata.

## Do not

- hand-edit `dist/`
- hide metadata generation in runtime helpers
- bypass established shared helpers without a strong reason
- treat `_internal` as public API unless the repo explicitly exports it
</instructions>
