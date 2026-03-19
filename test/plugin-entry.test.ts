import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

import copilotPlugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    version: string;
};

describe("plugin entry module", () => {
    it("exports the expected runtime plugin shape", () => {
        expect(copilotPlugin.meta).toEqual({
            name: "eslint-plugin-copilot",
            namespace: "copilot",
            version: packageJson.version,
        });

        expect(Object.keys(copilotPlugin.configs).toSorted()).toEqual([
            "all",
            "minimal",
            "recommended",
            "strict",
        ]);

        expect(Object.keys(copilotPlugin.rules).toSorted()).toEqual([
            "no-blank-customization-body",
            "no-blank-repository-instructions",
            "no-deprecated-agent-infer",
            "no-legacy-chatmode-files",
            "prefer-qualified-tools",
            "require-agent-tool-for-subagents",
            "require-chatmode-file-metadata",
            "require-github-copilot-target-for-mcp-servers",
            "require-instructions-apply-to",
            "require-prompt-file-metadata",
            "require-qualified-agent-handoff-models",
            "require-relative-agent-hook-cwd",
            "require-relative-prompt-links",
            "require-repository-instructions-file",
            "require-valid-agent-handoff-send",
            "require-valid-agent-handoffs",
            "require-valid-agent-hook-events",
            "require-valid-agent-hook-timeouts",
            "require-valid-agent-hooks",
            "require-valid-agent-invocation-controls",
            "require-valid-agent-mcp-servers",
            "require-valid-agent-model",
            "require-valid-agent-subagents",
            "require-valid-agent-target",
            "require-valid-agent-tools",
            "require-valid-prompt-model",
        ]);
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
