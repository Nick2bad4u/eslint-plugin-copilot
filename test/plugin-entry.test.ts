import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import copilotPlugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    version: string;
};

describe("plugin entry module", () => {
    it("exports the expected runtime plugin shape", () => {
        const exportedRuleNames = Object.keys(copilotPlugin.rules).toSorted(
            (left, right) => left.localeCompare(right)
        );

        expect(copilotPlugin.meta).toEqual({
            name: "eslint-plugin-copilot",
            namespace: "copilot",
            version: packageJson.version,
        });

        expect(
            Object.keys(copilotPlugin.configs).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toEqual([
            "all",
            "minimal",
            "recommended",
            "strict",
        ]);

        expect(exportedRuleNames).toHaveLength(69);
        expect(exportedRuleNames).toEqual(
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
        const runtimePluginModule = (await import("../plugin.mjs")) as {
            default: unknown;
        };

        expect(runtimePluginModule.default).toEqual(
            expect.objectContaining({
                meta: expect.objectContaining({
                    name: "eslint-plugin-copilot",
                    namespace: "copilot",
                }),
            })
        );
    });
});
