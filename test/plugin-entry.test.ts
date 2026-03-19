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
            "no-blank-repository-instructions",
            "prefer-qualified-tools",
            "require-chatmode-file-metadata",
            "require-instructions-apply-to",
            "require-prompt-file-metadata",
            "require-repository-instructions-file",
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
