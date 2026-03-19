# Repository instructions for GitHub Copilot

- This repository builds `eslint-plugin-copilot`, an ESLint plugin for linting GitHub Copilot repository customization files.
- Prefer solutions that improve rule metadata consistency, docs synchronization, and test coverage together.
- When editing rule docs, keep the required heading structure and include the stable rule catalog ID.
- When editing prompt files, keep frontmatter explicit and non-empty.
- When editing prompt or chat mode metadata, prefer fully qualified tool names.
- Preserve flat-config-first examples and avoid legacy `.eslintrc` guidance.
- Run targeted diagnostics first, then typecheck and tests before considering the work complete.
