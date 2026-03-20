---
name: "Typescript-File-Instructions"
description: "Guidelines for TypeScript Development targeting TypeScript 5.9+ and ES2024/Latest output"
applyTo: "**/*.ts, **/*.tsx"
---

# TypeScript Development Information

> We are using TypeScript 5.9+ and targeting ES2024/Latest output.

- Prefer native platform APIs and pure ES modules; do not introduce CommonJS helpers.
- Prefer modern built-ins such as `Array.prototype.at`, `Object.hasOwn`, and `Promise.allSettled` when they match repository conventions.

---

## Core Rules

### Types and strictness

- Assume strict TypeScript settings are enforced.
- Avoid `any`; prefer `unknown` plus narrowing, or precise generics.
- Preserve literals with `as const` or `satisfies` when authoring config-like objects.
- Write `noUncheckedIndexedAccess`-friendly code: when indexing arrays or records, handle `undefined` explicitly.

### Modules and exports

- Use ESM `import` / `export` only.
- Prefer named exports over default exports unless the surrounding module pattern already standardizes on a default export.
- Keep imports stable and non-circular.
- This repo uses bundler-style extension rewriting for source files, so prefer source imports without emitted `.js`/`.ts` suffixes unless the local convention for that folder requires otherwise.

### Domain modeling

- Prefer discriminated unions for stateful variants.
- Exhaustively narrow unions with `switch` and a `never` fallback.
- Centralize shared domain contracts instead of duplicating object shapes.
- Use built-in utility types first (`Readonly`, `Pick`, `Omit`, `Record`, `NonNullable`, etc.).

### Unsafe boundaries

- Isolate untyped or loosely typed inputs in small wrappers.
- Prefer runtime validation over unchecked casts.
- If a type escape hatch is unavoidable, keep it minimal and document why.

### Implementation style

- Prefer small, composable, mostly pure functions.
- Keep side effects at the edges.
- Use `readonly` arrays, fields, and object shapes when mutation is not intended.
- Prefer immutable updates when they keep the code clear enough.

### Async and errors

- Prefer `async` / `await` over callbacks.
- Throw real `Error` instances when throwing is appropriate.
- When a recoverable result is clearer than exceptions, use a typed result shape instead of mixed return conventions.

### Tests

- Keep test helpers and fixtures strongly typed too.
- Avoid `as any` in tests.
- When modeling JSON-like fixtures, use repository-approved JSON-safe types or a small local equivalent.

---
