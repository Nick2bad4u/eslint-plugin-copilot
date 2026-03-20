import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    rules: [
        {
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "🚀 Getting started",
            type: "doc",
        },
        {
            collapsible: true,
            items: [
                {
                    id: "guides/copilot-customization-files",
                    label: "Copilot customization files",
                    type: "doc",
                },
            ],
            label: "🧭 Guides",
            type: "category",
        },
        {
            collapsible: true,
            items: [
                {
                    id: "presets/index",
                    label: "Overview",
                    type: "doc",
                },
                {
                    id: "presets/minimal",
                    label: "🟢 Minimal",
                    type: "doc",
                },
                {
                    id: "presets/recommended",
                    label: "🟡 Recommended",
                    type: "doc",
                },
                {
                    id: "presets/strict",
                    label: "🔴 Strict",
                    type: "doc",
                },
                {
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
            label: "📦 Presets",
            type: "category",
        },
        {
            collapsible: true,
            items: [
                {
                    id: "require-instructions-apply-to",
                    label: "R001 · require-instructions-apply-to",
                    type: "doc",
                },
                {
                    id: "require-prompt-file-metadata",
                    label: "R002 · require-prompt-file-metadata",
                    type: "doc",
                },
                {
                    id: "require-chatmode-file-metadata",
                    label: "R003 · require-chatmode-file-metadata",
                    type: "doc",
                },
                {
                    id: "no-blank-repository-instructions",
                    label: "R004 · no-blank-repository-instructions",
                    type: "doc",
                },
                {
                    id: "require-repository-instructions-file",
                    label: "R005 · require-repository-instructions-file",
                    type: "doc",
                },
                {
                    id: "prefer-qualified-tools",
                    label: "R006 · prefer-qualified-tools",
                    type: "doc",
                },
                {
                    id: "no-deprecated-agent-infer",
                    label: "R007 · no-deprecated-agent-infer",
                    type: "doc",
                },
                {
                    id: "require-agent-tool-for-subagents",
                    label: "R008 · require-agent-tool-for-subagents",
                    type: "doc",
                },
                {
                    id: "no-blank-customization-body",
                    label: "R009 · no-blank-customization-body",
                    type: "doc",
                },
                {
                    id: "require-github-copilot-target-for-mcp-servers",
                    label: "R010 · require-github-copilot-target-for-mcp-servers",
                    type: "doc",
                },
                {
                    id: "no-legacy-chatmode-files",
                    label: "R011 · no-legacy-chatmode-files",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-handoffs",
                    label: "R012 · require-valid-agent-handoffs",
                    type: "doc",
                },
                {
                    id: "require-qualified-agent-handoff-models",
                    label: "R013 · require-qualified-agent-handoff-models",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hook-events",
                    label: "R014 · require-valid-agent-hook-events",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hooks",
                    label: "R015 · require-valid-agent-hooks",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hook-timeouts",
                    label: "R016 · require-valid-agent-hook-timeouts",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-subagents",
                    label: "R017 · require-valid-agent-subagents",
                    type: "doc",
                },
                {
                    id: "require-relative-agent-hook-cwd",
                    label: "R018 · require-relative-agent-hook-cwd",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-target",
                    label: "R019 · require-valid-agent-target",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-invocation-controls",
                    label: "R020 · require-valid-agent-invocation-controls",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-handoff-send",
                    label: "R021 · require-valid-agent-handoff-send",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-model",
                    label: "R022 · require-valid-agent-model",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-mcp-servers",
                    label: "R023 · require-valid-agent-mcp-servers",
                    type: "doc",
                },
                {
                    id: "require-relative-prompt-links",
                    label: "R024 · require-relative-prompt-links",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-tools",
                    label: "R025 · require-valid-agent-tools",
                    type: "doc",
                },
                {
                    id: "require-valid-prompt-model",
                    label: "R026 · require-valid-prompt-model",
                    type: "doc",
                },
                {
                    id: "require-valid-prompt-tools",
                    label: "R027 · require-valid-prompt-tools",
                    type: "doc",
                },
                {
                    id: "require-relative-agent-links",
                    label: "R028 · require-relative-agent-links",
                    type: "doc",
                },
                {
                    id: "require-relative-instructions-links",
                    label: "R029 · require-relative-instructions-links",
                    type: "doc",
                },
                {
                    id: "require-existing-relative-prompt-links",
                    label: "R030 · require-existing-relative-prompt-links",
                    type: "doc",
                },
                {
                    id: "require-existing-relative-agent-links",
                    label: "R031 · require-existing-relative-agent-links",
                    type: "doc",
                },
                {
                    id: "require-existing-relative-instructions-links",
                    label: "R032 · require-existing-relative-instructions-links",
                    type: "doc",
                },
                {
                    id: "require-existing-agent-mcp-servers",
                    label: "R033 · require-existing-agent-mcp-servers",
                    type: "doc",
                },
                {
                    id: "require-json-agent-mcp-servers",
                    label: "R034 · require-json-agent-mcp-servers",
                    type: "doc",
                },
                {
                    id: "require-existing-agent-hook-cwd",
                    label: "R035 · require-existing-agent-hook-cwd",
                    type: "doc",
                },
                {
                    id: "prefer-custom-instructions-under-code-review-limit",
                    label: "R036 · prefer-custom-instructions-under-code-review-limit",
                    type: "doc",
                },
                {
                    id: "require-agents-md-for-cross-surface-agent-instructions",
                    label: "R037 · require-agents-md-for-cross-surface-agent-instructions",
                    type: "doc",
                },
                {
                    id: "no-duplicate-prompt-names",
                    label: "R038 · no-duplicate-prompt-names",
                    type: "doc",
                },
                {
                    id: "no-duplicate-agent-names",
                    label: "R039 · no-duplicate-agent-names",
                    type: "doc",
                },
                {
                    id: "require-valid-prompt-name",
                    label: "R040 · require-valid-prompt-name",
                    type: "doc",
                },
                {
                    id: "require-valid-prompt-argument-hint",
                    label: "R041 · require-valid-prompt-argument-hint",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-name",
                    label: "R042 · require-valid-agent-name",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-argument-hint",
                    label: "R043 · require-valid-agent-argument-hint",
                    type: "doc",
                },
                {
                    id: "require-valid-instructions-apply-to-globs",
                    label: "R044 · require-valid-instructions-apply-to-globs",
                    type: "doc",
                },
                {
                    id: "require-skill-file-location",
                    label: "R045 · require-skill-file-location",
                    type: "doc",
                },
                {
                    id: "require-skill-file-metadata",
                    label: "R046 · require-skill-file-metadata",
                    type: "doc",
                },
                {
                    id: "no-blank-skill-body",
                    label: "R047 · no-blank-skill-body",
                    type: "doc",
                },
                {
                    id: "require-valid-skill-name",
                    label: "R048 · require-valid-skill-name",
                    type: "doc",
                },
                {
                    id: "require-valid-skill-directory-name",
                    label: "R049 · require-valid-skill-directory-name",
                    type: "doc",
                },
                {
                    id: "require-skill-name-match-directory",
                    label: "R050 · require-skill-name-match-directory",
                    type: "doc",
                },
                {
                    id: "require-valid-skill-license",
                    label: "R051 · require-valid-skill-license",
                    type: "doc",
                },
                {
                    id: "require-relative-skill-links",
                    label: "R052 · require-relative-skill-links",
                    type: "doc",
                },
                {
                    id: "require-existing-relative-skill-links",
                    label: "R053 · require-existing-relative-skill-links",
                    type: "doc",
                },
                {
                    id: "no-duplicate-skill-names",
                    label: "R054 · no-duplicate-skill-names",
                    type: "doc",
                },
                {
                    id: "require-skill-md-filename",
                    label: "R055 · require-skill-md-filename",
                    type: "doc",
                },
                {
                    id: "require-valid-repository-hook-version",
                    label: "R056 · require-valid-repository-hook-version",
                    type: "doc",
                },
                {
                    id: "require-repository-hooks-object",
                    label: "R057 · require-repository-hooks-object",
                    type: "doc",
                },
                {
                    id: "require-repository-hook-arrays",
                    label: "R058 · require-repository-hook-arrays",
                    type: "doc",
                },
                {
                    id: "require-valid-repository-hook-events",
                    label: "R059 · require-valid-repository-hook-events",
                    type: "doc",
                },
                {
                    id: "require-valid-repository-hook-command-type",
                    label: "R060 · require-valid-repository-hook-command-type",
                    type: "doc",
                },
                {
                    id: "require-repository-hook-command-shell",
                    label: "R061 · require-repository-hook-command-shell",
                    type: "doc",
                },
                {
                    id: "require-relative-repository-hook-cwd",
                    label: "R062 · require-relative-repository-hook-cwd",
                    type: "doc",
                },
                {
                    id: "require-existing-repository-hook-cwd",
                    label: "R063 · require-existing-repository-hook-cwd",
                    type: "doc",
                },
                {
                    id: "require-valid-repository-hook-timeouts",
                    label: "R064 · require-valid-repository-hook-timeouts",
                    type: "doc",
                },
                {
                    id: "require-valid-repository-hook-env",
                    label: "R065 · require-valid-repository-hook-env",
                    type: "doc",
                },
                {
                    id: "require-string-repository-hook-env-values",
                    label: "R066 · require-string-repository-hook-env-values",
                    type: "doc",
                },
                {
                    id: "no-empty-repository-hook-arrays",
                    label: "R067 · no-empty-repository-hook-arrays",
                    type: "doc",
                },
                {
                    id: "prefer-fast-repository-hooks",
                    label: "R068 · prefer-fast-repository-hooks",
                    type: "doc",
                },
                {
                    id: "no-duplicate-slash-command-names",
                    label: "R069 · no-duplicate-slash-command-names",
                    type: "doc",
                },
            ],
            label: "📘 Rules",
            type: "category",
        },
    ],
};

export default sidebars;
