---
name: "JSON-Guidelines"
description: "Instructions for writing clear, consistent JSON for configs and code."
applyTo: "**/*.json"
---

# JSON

Write JSON that is strict, readable, and tool-friendly.

## Core rules

- Use valid JSON only: double quotes, no trailing commas, no comments.
- Prefer one top-level object unless the tool requires another shape.
- Keep keys stable and intentional; group metadata first when that improves readability.
- Prefer arrays for repeated items and small objects for structured options.

## Values and structure

- Use the correct primitive types for flags, paths, counts, and messages.
- Escape backslashes and regex-like strings correctly.
- Prefer empty arrays or objects over ambiguous `null` when the tool expects “no items”.
- Use `$schema` when supported to improve validation and editor assistance.

## Security and tooling

- Never commit real secrets; use placeholders in examples.
- Keep configs parseable by generic tooling and repo scripts.
- Prefer the repository's real format/lint/validation scripts over template-only command names.
