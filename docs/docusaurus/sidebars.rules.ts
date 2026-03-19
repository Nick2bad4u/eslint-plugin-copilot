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
                    id: "no-blank-repository-instructions",
                    label: "R004 · no-blank-repository-instructions",
                    type: "doc",
                },
                {
                    id: "prefer-qualified-tools",
                    label: "R006 · prefer-qualified-tools",
                    type: "doc",
                },
                {
                    id: "require-chatmode-file-metadata",
                    label: "R003 · require-chatmode-file-metadata",
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
                    id: "require-repository-instructions-file",
                    label: "R005 · require-repository-instructions-file",
                    type: "doc",
                },
            ],
            label: "📘 Rules",
            type: "category",
        },
    ],
};

export default sidebars;
