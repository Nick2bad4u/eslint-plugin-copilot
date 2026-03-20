---
name: GitHub-Actions-CI-CD-Best-Practices
description: "Practical guidance for secure, maintainable GitHub Actions workflows in this repository."
applyTo: ".github/workflows/*.yml"
---

# GitHub Actions CI/CD Best Practices

## Mission

Design workflows that are secure, readable, and aligned with the repository's actual scripts and release flow.

## Workflow structure

- Use descriptive workflow and job names.
- Prefer package-oriented jobs in this repo: build, typecheck, test, docs, release verification, publish.
- Use `needs`, `if`, and `concurrency` deliberately so execution order is obvious.
- Keep workflow triggers as narrow as the use case allows.

## Actions and steps

- Prefer trusted actions and stable pinned versions.
- Use `actions/setup-node` with the repository's real Node version source and `cache: npm` before adding custom cache logic.
- Keep steps small, named, and easy to debug.
- Use the scripts that actually exist in the repository instead of template-only commands.

## Security

- Use GitHub secrets or environment secrets for sensitive values.
- Never print secrets to logs.
- Prefer least-privilege `GITHUB_TOKEN` permissions.
- Use OIDC where supported; for npm releases, prefer `id-token: write` plus `npm publish --provenance`.
- Add dependency review, SAST, and secret scanning when they fit the repository.

## Validation and maintenance

- Fail fast on broken builds, tests, docs, or release checks.
- Preserve artifact handoff when a release or deploy flow needs the exact verified output.
- Keep examples aligned with the current package manager, Node version strategy, and publish process.
- When the repo includes CI-fix helpers or skills, use them to diagnose failures before guessing.
