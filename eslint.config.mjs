import nick2bad4u from "eslint-config-nick2bad4u";

import copilot from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutCopilot,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Copilot",
        plugins: {
            copilot: copilot,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...copilot.configs.all[0].rules,
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...copilot.configs.all[1].rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
