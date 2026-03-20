---
name: "Docusaurus-Typedoc-Folder-Guidelines"
description: "Guidance for the Docusaurus + TypeDoc documentation app under docs/docusaurus/."
applyTo: "docs/docusaurus/**"
---

# Docusaurus + TypeDoc (docs/docusaurus/) Guidelines

- Treat `docs/docusaurus/` as the docs app for the repository.
- Keep Docusaurus config, TypeDoc config, TS config, and repo scripts aligned.

## Key files

- `docusaurus.config.ts`: site identity, plugins, navbar/footer, edit URLs.
- `sidebars*.ts`: stable navigation for docs and rule pages.
- `typedoc.config.*` plus `typedoc-plugins/`: API-doc pipeline.
- `src/`: React/TSX app code and theme customizations.
- `site-docs/`: hand-authored docs.
- `static/`: raw static assets and generated inspector output.

## Generated vs authored content

- Do not hand-edit generated API docs or generated inspector output.
- If sidebar ids drift after API regeneration, regenerate first, then update the sidebar to match current generated ids.
- Put explanatory prose in tracked hand-authored docs, not inside generated output folders.

## Workflow expectations

- Prefer the repository's real docs scripts instead of template-only command names.
- Keep examples, URLs, and repo identity values current when copying or adapting this setup.
- Prefer Markdown/MDX for prose-heavy content; keep TSX pages focused on UI concerns.
