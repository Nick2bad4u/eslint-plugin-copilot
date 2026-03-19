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
            "copilot/no-blank-customization-body",
            "copilot/no-blank-repository-instructions",
            "copilot/no-deprecated-agent-infer",
            "copilot/no-legacy-chatmode-files",
            "copilot/require-agent-tool-for-subagents",
            "copilot/require-chatmode-file-metadata",
            "copilot/require-github-copilot-target-for-mcp-servers",
            "copilot/require-instructions-apply-to",
            "copilot/require-prompt-file-metadata",
            "copilot/require-qualified-agent-handoff-models",
            "copilot/require-relative-agent-hook-cwd",
            "copilot/require-relative-prompt-links",
            "copilot/require-valid-agent-handoff-send",
            "copilot/require-valid-agent-handoffs",
            "copilot/require-valid-agent-hook-events",
            "copilot/require-valid-agent-hook-timeouts",
            "copilot/require-valid-agent-hooks",
            "copilot/require-valid-agent-invocation-controls",
            "copilot/require-valid-agent-mcp-servers",
            "copilot/require-valid-agent-model",
            "copilot/require-valid-agent-subagents",
            "copilot/require-valid-agent-target",
            "copilot/require-valid-agent-tools",
            "copilot/require-valid-prompt-model",
        ]);

        expect(Object.keys(copilotPlugin.configs.strict.rules)).toContain(
            "copilot/require-repository-instructions-file"
        );
        expect(Object.keys(copilotPlugin.configs.all.rules)).toContain(
            "copilot/prefer-qualified-tools"
        );
    });
});
