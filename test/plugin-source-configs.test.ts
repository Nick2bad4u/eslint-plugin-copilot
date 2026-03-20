import { describe, expect, it } from "vitest";

import copilotPlugin from "../src/plugin";

describe("source plugin config wiring", () => {
    const collectRuleKeys = (configName: keyof typeof copilotPlugin.configs) =>
        copilotPlugin.configs[configName].flatMap((layer) =>
            Object.keys(layer.rules)
        );

    const compareStrings = (left: string, right: string) =>
        left.localeCompare(right);

    it("registers layered markdown and JSON-aware Copilot presets", () => {
        for (const configName of Object.keys(copilotPlugin.configs).toSorted(
            compareStrings
        )) {
            const configLayers =
                copilotPlugin.configs[
                    configName as keyof typeof copilotPlugin.configs
                ];
            const markdownLayer = configLayers[0];

            expect(markdownLayer?.files).toContain(
                ".github/copilot-instructions.md"
            );
            expect(markdownLayer?.files).toContain(".github/skills/**/*.md");
            expect(markdownLayer?.language).toBe("markdown/gfm");
            expect(markdownLayer?.plugins).toHaveProperty("copilot");
            expect(markdownLayer?.plugins).toHaveProperty("markdown");

            const jsonLayer = configLayers.find(
                (layer) => layer.language === "json/json"
            );

            if (configName === "minimal") {
                expect(jsonLayer).toBeUndefined();
            } else {
                expect(jsonLayer?.files).toContain(".github/hooks/**/*.json");
                expect(jsonLayer?.plugins).toHaveProperty("copilot");
                expect(jsonLayer?.plugins).toHaveProperty("json");
            }
        }
    });

    it("layers rule membership across presets", () => {
        expect(collectRuleKeys("minimal").toSorted(compareStrings)).toEqual([
            "copilot/require-chatmode-file-metadata",
            "copilot/require-instructions-apply-to",
            "copilot/require-prompt-file-metadata",
        ]);

        expect(collectRuleKeys("recommended")).toEqual(
            expect.arrayContaining([
                "copilot/no-blank-skill-body",
                "copilot/no-duplicate-agent-names",
                "copilot/no-duplicate-prompt-names",
                "copilot/no-duplicate-skill-names",
                "copilot/no-duplicate-slash-command-names",
                "copilot/require-json-agent-mcp-servers",
                "copilot/require-relative-agent-links",
                "copilot/require-relative-instructions-links",
                "copilot/require-relative-skill-links",
                "copilot/require-repository-hook-arrays",
                "copilot/require-repository-hook-command-shell",
                "copilot/require-repository-hooks-object",
                "copilot/require-skill-file-location",
                "copilot/require-skill-file-metadata",
                "copilot/require-skill-md-filename",
                "copilot/require-valid-prompt-tools",
                "copilot/require-valid-repository-hook-command-type",
                "copilot/require-valid-repository-hook-env",
                "copilot/require-valid-repository-hook-events",
                "copilot/require-valid-repository-hook-timeouts",
                "copilot/require-valid-repository-hook-version",
                "copilot/require-valid-skill-name",
            ])
        );

        expect(collectRuleKeys("strict")).toEqual(
            expect.arrayContaining([
                "copilot/no-empty-repository-hook-arrays",
                "copilot/prefer-custom-instructions-under-code-review-limit",
                "copilot/prefer-fast-repository-hooks",
                "copilot/require-agents-md-for-cross-surface-agent-instructions",
                "copilot/require-existing-agent-hook-cwd",
                "copilot/require-existing-agent-mcp-servers",
                "copilot/require-existing-relative-agent-links",
                "copilot/require-existing-relative-instructions-links",
                "copilot/require-existing-relative-prompt-links",
                "copilot/require-existing-relative-skill-links",
                "copilot/require-existing-repository-hook-cwd",
                "copilot/require-skill-name-match-directory",
                "copilot/require-string-repository-hook-env-values",
                "copilot/require-valid-skill-license",
            ])
        );

        expect(collectRuleKeys("strict")).toContain(
            "copilot/require-repository-instructions-file"
        );

        expect(collectRuleKeys("all")).toContain(
            "copilot/prefer-qualified-tools"
        );
    });
});
