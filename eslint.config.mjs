import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutCopilot,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Copilot",
        plugins: {
            copilot: plugin,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...plugin.configs.all[0].rules,
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...plugin.configs.all[1].rules,
        },
    },
    {
        files: ["eslint.config.mjs"],
        name: "Config File Type-Safety Guardrails",
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
        },
    },
    {
        files: ["src/plugin.ts"],
        name: "Plugin Entrypoint Compatibility Guardrails",
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "import-x/extensions": "off",
        },
    },
    {
        files: ["src/_internal/create-copilot-rule.ts"],
        name: "Rule Creator Generic Narrowing",
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
        },
    },
    {
        files: [
            "commitlint.config.mjs",
            "scripts/**/*.mjs",
            "docs/docusaurus/typedoc-plugins/**/*.mjs",
        ],
        name: "Tooling Script Documentation Posture",
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-misused-spread": "off",
            "jsdoc/check-tag-names": "off",
            "jsdoc/match-description": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/reject-any-type": "off",
            "jsdoc/require-throws": "off",
        },
    },
    {
        files: [".github/workflows/auto-merge-dependabot-caller.yml"],
        name: "Reusable Dependabot Workflow Caller",
        rules: {
            "github-actions/no-external-job": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
