import { describe, expect, it } from "vitest";

import { lintCopilotFiles } from "./_internal/lint-copilot-files";

const messageIdsFor = async (
    jsonText: string,
    ruleId: string,
    additionalFiles?: Readonly<Record<string, string>>
): Promise<readonly string[]> => {
    const [result] = await lintCopilotFiles({
        files: {
            ".github/hooks/hooks.json": jsonText,
            ...additionalFiles,
        },
        ruleId,
        targetFiles: [".github/hooks/hooks.json"],
    });

    return result?.messages.map((message) => message.messageId ?? "") ?? [];
};

describe("repository hook backlog rules", () => {
    it("require-valid-repository-hook-version reports non-1 versions", async () => {
        await expect(
            messageIdsFor(
                '{"version":2,"hooks":{}}',
                "require-valid-repository-hook-version"
            )
        ).resolves.toEqual(["invalidRepositoryHookVersion"]);
    });

    it("require-repository-hooks-object reports missing hooks objects", async () => {
        await expect(
            messageIdsFor('{"version":1}', "require-repository-hooks-object")
        ).resolves.toEqual(["invalidRepositoryHooksObject"]);
    });

    it("require-repository-hook-arrays reports non-array hook values", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":{}}}',
                "require-repository-hook-arrays"
            )
        ).resolves.toEqual(["invalidRepositoryHookArray"]);
    });

    it("require-valid-repository-hook-events reports unsupported events", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"beforeAnything":[]}}',
                "require-valid-repository-hook-events"
            )
        ).resolves.toEqual(["invalidRepositoryHookEvent"]);
    });

    it("require-valid-repository-hook-command-type reports missing types", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"bash":"echo hi"}]}}',
                "require-valid-repository-hook-command-type"
            )
        ).resolves.toEqual(["invalidRepositoryHookType"]);
    });

    it("require-repository-hook-command-shell reports command hooks without shell commands", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command"}]}}',
                "require-repository-hook-command-shell"
            )
        ).resolves.toEqual(["missingRepositoryHookShellCommand"]);
    });

    it("require-relative-repository-hook-cwd reports absolute cwd values", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"/tmp"}]}}',
                "require-relative-repository-hook-cwd"
            )
        ).resolves.toEqual(["nonRelativeRepositoryHookCwd"]);
    });

    it("require-existing-repository-hook-cwd reports missing relative cwd targets", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"scripts/hooks"}]}}',
                "require-existing-repository-hook-cwd"
            )
        ).resolves.toEqual(["missingRepositoryHookCwd"]);
    });

    it("require-valid-repository-hook-timeouts reports invalid timeoutSec values", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","timeoutSec":0}]}}',
                "require-valid-repository-hook-timeouts"
            )
        ).resolves.toEqual(["invalidRepositoryHookTimeout"]);
    });

    it("require-valid-repository-hook-env reports non-object env values", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","env":["A"]}]}}',
                "require-valid-repository-hook-env"
            )
        ).resolves.toEqual(["invalidRepositoryHookEnv"]);
    });

    it("require-string-repository-hook-env-values reports non-string env entries", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","env":{"A":1}}]}}',
                "require-string-repository-hook-env-values"
            )
        ).resolves.toEqual(["nonStringRepositoryHookEnvValue"]);
    });

    it("no-empty-repository-hook-arrays reports empty hook arrays", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[]}}',
                "no-empty-repository-hook-arrays"
            )
        ).resolves.toEqual(["emptyRepositoryHookArray"]);
    });

    it("prefer-fast-repository-hooks reports large timeout budgets", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","timeoutSec":120}]}}',
                "prefer-fast-repository-hooks"
            )
        ).resolves.toEqual(["slowRepositoryHookTimeout"]);
    });

    it("accepts a valid repository hook configuration", async () => {
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"scripts","timeoutSec":10,"env":{"LOG_LEVEL":"info"}}],"postToolUse":[{"type":"prompt","prompt":"/review"}]}}',
                "require-valid-repository-hook-events",
                {
                    "scripts/.gitkeep": "",
                }
            )
        ).resolves.toEqual([]);
    });
});
