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
                    id: "no-blank-customization-body",
                    label: "R009 · no-blank-customization-body",
                    type: "doc",
                },
                {
                    id: "no-deprecated-agent-infer",
                    label: "R007 · no-deprecated-agent-infer",
                    type: "doc",
                },
                {
                    id: "no-blank-repository-instructions",
                    label: "R004 · no-blank-repository-instructions",
                    type: "doc",
                },
                {
                    id: "no-legacy-chatmode-files",
                    label: "R011 · no-legacy-chatmode-files",
                    type: "doc",
                },
                {
                    id: "prefer-qualified-tools",
                    label: "R006 · prefer-qualified-tools",
                    type: "doc",
                },
                {
                    id: "require-agent-tool-for-subagents",
                    label: "R008 · require-agent-tool-for-subagents",
                    type: "doc",
                },
                {
                    id: "require-chatmode-file-metadata",
                    label: "R003 · require-chatmode-file-metadata",
                    type: "doc",
                },
                {
                    id: "require-github-copilot-target-for-mcp-servers",
                    label: "R010 · require-github-copilot-target-for-mcp-servers",
                    type: "doc",
                },
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
                    id: "require-qualified-agent-handoff-models",
                    label: "R013 · require-qualified-agent-handoff-models",
                    type: "doc",
                },
                {
                    id: "require-relative-agent-hook-cwd",
                    label: "R018 · require-relative-agent-hook-cwd",
                    type: "doc",
                },
                {
                    id: "require-relative-prompt-links",
                    label: "R024 · require-relative-prompt-links",
                    type: "doc",
                },
                {
                    id: "require-repository-instructions-file",
                    label: "R005 · require-repository-instructions-file",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-tools",
                    label: "R025 · require-valid-agent-tools",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hook-events",
                    label: "R015 · require-valid-agent-hook-events",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-invocation-controls",
                    label: "R020 · require-valid-agent-invocation-controls",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hooks",
                    label: "R014 · require-valid-agent-hooks",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-hook-timeouts",
                    label: "R016 · require-valid-agent-hook-timeouts",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-handoffs",
                    label: "R012 · require-valid-agent-handoffs",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-handoff-send",
                    label: "R021 · require-valid-agent-handoff-send",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-subagents",
                    label: "R017 · require-valid-agent-subagents",
                    type: "doc",
                },
                {
                    id: "require-valid-agent-target",
                    label: "R019 · require-valid-agent-target",
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
                    id: "require-valid-prompt-model",
                    label: "R026 · require-valid-prompt-model",
                    type: "doc",
                },
            ],
            label: "📘 Rules",
            type: "category",
        },
    ],
};

export default sidebars;
