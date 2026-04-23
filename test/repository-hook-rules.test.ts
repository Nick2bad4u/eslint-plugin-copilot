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
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":2,"hooks":{}}',
                "require-valid-repository-hook-version"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookVersion"]);
    });

    it("require-repository-hooks-object reports missing hooks objects", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor('{"version":1}', "require-repository-hooks-object")
        ).resolves.toStrictEqual(["invalidRepositoryHooksObject"]);
    });

    it("require-repository-hook-arrays reports non-array hook values", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":{}}}',
                "require-repository-hook-arrays"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookArray"]);
    });

    it("require-valid-repository-hook-events reports unsupported events", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"beforeAnything":[]}}',
                "require-valid-repository-hook-events"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookEvent"]);
    });

    it("require-valid-repository-hook-command-type reports missing types", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"bash":"echo hi"}]}}',
                "require-valid-repository-hook-command-type"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookType"]);
    });

    it("require-repository-hook-command-shell reports command hooks without shell commands", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command"}]}}',
                "require-repository-hook-command-shell"
            )
        ).resolves.toStrictEqual(["missingRepositoryHookShellCommand"]);
    });

    it("require-relative-repository-hook-cwd reports absolute cwd values", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"/tmp"}]}}',
                "require-relative-repository-hook-cwd"
            )
        ).resolves.toStrictEqual(["nonRelativeRepositoryHookCwd"]);
    });

    it("require-existing-repository-hook-cwd reports missing relative cwd targets", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"scripts/hooks"}]}}',
                "require-existing-repository-hook-cwd"
            )
        ).resolves.toStrictEqual(["missingRepositoryHookCwd"]);
    });

    it("require-valid-repository-hook-timeouts reports invalid timeoutSec values", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","timeoutSec":0}]}}',
                "require-valid-repository-hook-timeouts"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookTimeout"]);
    });

    it("require-valid-repository-hook-env reports non-object env values", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","env":["A"]}]}}',
                "require-valid-repository-hook-env"
            )
        ).resolves.toStrictEqual(["invalidRepositoryHookEnv"]);
    });

    it("require-string-repository-hook-env-values reports non-string env entries", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","env":{"A":1}}]}}',
                "require-string-repository-hook-env-values"
            )
        ).resolves.toStrictEqual(["nonStringRepositoryHookEnvValue"]);
    });

    it("no-empty-repository-hook-arrays reports empty hook arrays", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[]}}',
                "no-empty-repository-hook-arrays"
            )
        ).resolves.toStrictEqual(["emptyRepositoryHookArray"]);
    });

    it("prefer-fast-repository-hooks reports large timeout budgets", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","timeoutSec":120}]}}',
                "prefer-fast-repository-hooks"
            )
        ).resolves.toStrictEqual(["slowRepositoryHookTimeout"]);
    });

    it("accepts a valid repository hook configuration", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                '{"version":1,"hooks":{"sessionStart":[{"type":"command","bash":"echo hi","cwd":"scripts","timeoutSec":10,"env":{"LOG_LEVEL":"info"}}],"postToolUse":[{"type":"prompt","prompt":"/review"}]}}',
                "require-valid-repository-hook-events",
                {
                    "scripts/.gitkeep": "",
                }
            )
        ).resolves.toStrictEqual([]);
    });
});
