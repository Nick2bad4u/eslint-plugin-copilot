import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    version: string;
};

describe("plugin entry module", () => {
    it("exports the expected runtime plugin shape", () => {
        expect.hasAssertions();

        const exportedRuleNames = Object.keys(plugin.rules).toSorted(
            (left, right) => left.localeCompare(right)
        );

        expect(plugin.meta).toStrictEqual({
            name: "eslint-plugin-copilot",
            namespace: "copilot",
            version: packageJson.version,
        });

        expect(
            Object.keys(plugin.configs).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toStrictEqual([
            "all",
            "all-without-language-plugins",
            "minimal",
            "minimal-without-language-plugins",
            "recommended",
            "recommended-without-language-plugins",
            "strict",
            "strict-without-language-plugins",
        ]);

        expect(exportedRuleNames).toHaveLength(69);
        expect(exportedRuleNames).toStrictEqual(
            expect.arrayContaining([
                "no-blank-customization-body",
                "no-blank-skill-body",
                "no-duplicate-agent-names",
                "no-duplicate-prompt-names",
                "no-duplicate-skill-names",
                "no-duplicate-slash-command-names",
                "no-empty-repository-hook-arrays",
                "prefer-custom-instructions-under-code-review-limit",
                "prefer-fast-repository-hooks",
                "require-agents-md-for-cross-surface-agent-instructions",
                "require-existing-agent-hook-cwd",
                "require-existing-agent-mcp-servers",
                "require-existing-relative-agent-links",
                "require-existing-relative-instructions-links",
                "require-existing-relative-prompt-links",
                "require-existing-relative-skill-links",
                "require-existing-repository-hook-cwd",
                "require-json-agent-mcp-servers",
                "require-relative-agent-links",
                "require-relative-instructions-links",
                "require-relative-repository-hook-cwd",
                "require-relative-skill-links",
                "require-repository-hook-arrays",
                "require-repository-hook-command-shell",
                "require-repository-hooks-object",
                "require-skill-file-location",
                "require-skill-file-metadata",
                "require-skill-md-filename",
                "require-skill-name-match-directory",
                "require-string-repository-hook-env-values",
                "require-valid-agent-argument-hint",
                "require-valid-agent-name",
                "require-valid-instructions-apply-to-globs",
                "require-valid-prompt-argument-hint",
                "require-valid-prompt-name",
                "require-valid-prompt-tools",
                "require-valid-repository-hook-command-type",
                "require-valid-repository-hook-env",
                "require-valid-repository-hook-events",
                "require-valid-repository-hook-timeouts",
                "require-valid-repository-hook-version",
                "require-valid-skill-directory-name",
                "require-valid-skill-license",
                "require-valid-skill-name",
            ])
        );
    });

    it("matches the runtime default export exposed through plugin.mjs", async () => {
        expect.hasAssertions();

        const runtimePluginModule = await import("../plugin.mjs");

        expect(runtimePluginModule.default).toStrictEqual(
            expect.objectContaining({
                meta: expect.objectContaining({
                    name: "eslint-plugin-copilot",
                    namespace: "copilot",
                }),
            })
        );
    });
});
