import { describe, expect, it } from "vitest";

import copilotPlugin from "../src/plugin";

describe("source plugin config wiring", () => {
    it("registers markdown-aware Copilot presets", () => {
        for (const configName of Object.keys(
            copilotPlugin.configs
        ).toSorted()) {
            const config =
                copilotPlugin.configs[
                    configName as keyof typeof copilotPlugin.configs
                ];

            expect(config.files).toContain(".github/copilot-instructions.md");
            expect(config.language).toBe("markdown/gfm");
            expect(config.plugins).toHaveProperty("copilot");
            expect(config.plugins).toHaveProperty("markdown");
        }
    });

    it("layers rule membership across presets", () => {
        expect(
            Object.keys(copilotPlugin.configs.minimal.rules).toSorted()
        ).toEqual([
            "copilot/require-chatmode-file-metadata",
            "copilot/require-instructions-apply-to",
            "copilot/require-prompt-file-metadata",
        ]);

        expect(
            Object.keys(copilotPlugin.configs.recommended.rules).toSorted()
        ).toEqual([
            "copilot/no-blank-repository-instructions",
            "copilot/require-chatmode-file-metadata",
            "copilot/require-instructions-apply-to",
            "copilot/require-prompt-file-metadata",
        ]);

        expect(Object.keys(copilotPlugin.configs.strict.rules)).toContain(
            "copilot/require-repository-instructions-file"
        );
        expect(Object.keys(copilotPlugin.configs.all.rules)).toContain(
            "copilot/prefer-qualified-tools"
        );
    });
});
