# Contributing to eslint-plugin-copilot

Thanks for your interest in contributing.

This repository contains an ESLint plugin focused on GitHub Copilot repository customization files, especially repository instructions, path-specific instructions, prompt files, custom chat modes, and related markdown-first Copilot assets.

## Prerequisites

- Node.js `>=22.0.0`
- npm `>=11`
- Git

## Local setup

1. Fork and clone the repository.

2. Install dependencies from the repository root:

   ```bash
   npm ci --force
   ```

3. Run the main validation steps:

   ```bash
   npm run lint:all:fix:quiet
   npm run typecheck
   npm test
   ```

## Recommended workflow

1. Create a branch from `main`.
2. Make focused changes.
3. Add or update tests in `test/` when behavior changes.
4. Update relevant documentation in `docs/` and `README.md`.
5. Run the validation commands before opening a pull request.

## Project layout

```text
.
├── src/                  # Plugin source and rule implementations
├── test/                 # Rule tests and test helpers
├── docs/                 # Rule docs and Docusaurus docs app
├── scripts/              # Repository scripts
├── .github/              # Workflows and Copilot customization assets
└── package.json          # Scripts, dependencies, metadata
```

## Validation commands

Use these locally before submitting a pull request:

- `npm run typecheck`
- `npm test`
- `npm run lint:all:fix:quiet`
- `npm run sync:readme-rules-table`
- `npm run sync:presets-rules-matrix`

## Rule authoring expectations

- Keep rules deterministic and static when possible.
- Favor setup correctness and metadata validation over speculative content analysis.
- Keep docs URLs, rule metadata, preset inclusion, README tables, and tests in sync.
- Prefer targeted tests that assert the public rule contract.

## Pull request expectations

- Keep pull requests scoped and reviewable.
- Include tests for behavior changes.
- Keep docs in sync with implementation changes.
- Avoid unrelated dependency or lockfile churn.

## Security

Do not open public issues for potential vulnerabilities.
Use the process described in [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).
