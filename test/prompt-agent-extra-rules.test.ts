import { describe, expect, it } from "vitest";

import { lintCopilotFiles } from "./_internal/lint-copilot-files";
import { lintMarkdownRule } from "./_internal/lint-markdown-file";

const messageIdsFor = async (
    files: Readonly<Record<string, string>>,
    ruleId: string,
    targetFile: string
): Promise<readonly string[]> => {
    const [result] = await lintCopilotFiles({
        files,
        ruleId,
        targetFiles: [targetFile],
    });

    return result?.messages.map((message) => message.messageId ?? "") ?? [];
};

describe("prompt and agent metadata backlog rules", () => {
    it("require-valid-prompt-tools reports scalar tools values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-tools",
            text: "---\ndescription: Review changes\ntools: fetch\n---\nReview the diff.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptTools",
        ]);
    });

    it("require-valid-prompt-name reports blank name values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-name",
            text: "---\ndescription: Review changes\nname:\n---\nReview the diff.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptName",
        ]);
    });

    it("require-valid-prompt-argument-hint reports blank argument-hint values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-argument-hint",
            text: "---\ndescription: Review changes\nargument-hint:\n---\nReview the diff.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptArgumentHint",
        ]);
    });

    it("require-valid-agent-name reports blank agent names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-name",
            text: "---\ndescription: Review code\nname:\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentName",
        ]);
    });

    it("require-valid-agent-argument-hint reports blank agent argument-hint values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-argument-hint",
            text: "---\ndescription: Review code\nargument-hint:\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentArgumentHint",
        ]);
    });

    it("require-json-agent-mcp-servers reports non-json entries", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-json-agent-mcp-servers",
            text: "---\ndescription: Release coordination\ntarget: github-copilot\nmcp-servers: [release-coordinator]\n---\nCoordinate release work.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "nonJsonAgentMcpServer",
        ]);
    });

    it("require-existing-agent-mcp-servers reports missing config files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-existing-agent-mcp-servers",
            text: "---\ndescription: Release coordination\ntarget: github-copilot\nmcp-servers: [release-coordinator.json]\n---\nCoordinate release work.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingAgentMcpServer",
        ]);
    });

    it("require-existing-agent-hook-cwd reports missing hook cwd folders", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-existing-agent-hook-cwd",
            text: "---\ndescription: Review code\nhooks:\n  SessionStart:\n    - type: command\n      command: echo ready\n      cwd: scripts/review\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingAgentHookCwd",
        ]);
    });

    it("require-valid-instructions-apply-to-globs reports non-repository-relative patterns", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/frontend.instructions.md",
            ruleId: "require-valid-instructions-apply-to-globs",
            text: '---\ndescription: Frontend rules\napplyTo: "./src/**/*.ts"\n---\nUse explicit return types.\n',
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidApplyToGlob",
        ]);
    });

    it("prefer-custom-instructions-under-code-review-limit reports oversized repository instructions", async () => {
        const longBody = "a".repeat(4010);
        const messages = await lintMarkdownRule({
            filePath: ".github/copilot-instructions.md",
            ruleId: "prefer-custom-instructions-under-code-review-limit",
            text: longBody,
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "exceedsCodeReviewLimit",
        ]);
    });

    it("require-agents-md-for-cross-surface-agent-instructions reports CLAUDE.md without sibling AGENTS.md", async () => {
        const messages = await lintMarkdownRule({
            filePath: "docs/CLAUDE.md",
            ruleId: "require-agents-md-for-cross-surface-agent-instructions",
            text: "Follow the repository workflow.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingAgentsMdSibling",
        ]);
    });

    it("no-duplicate-prompt-names reports duplicate effective prompt names", async () => {
        await expect(
            messageIdsFor(
                {
                    ".github/prompts/other.prompt.md":
                        "---\ndescription: Review changes\nname: review\n---\nReview another diff.\n",
                    ".github/prompts/review.prompt.md":
                        "---\ndescription: Review changes\n---\nReview the diff.\n",
                },
                "no-duplicate-prompt-names",
                ".github/prompts/review.prompt.md"
            )
        ).resolves.toEqual(["duplicatePromptName"]);
    });

    it("no-duplicate-agent-names reports duplicate effective agent names", async () => {
        await expect(
            messageIdsFor(
                {
                    ".github/agents/other.agent.md":
                        "---\ndescription: Review code\nname: reviewer\n---\nReview security concerns.\n",
                    ".github/agents/reviewer.agent.md":
                        "---\ndescription: Review code\n---\nReview code carefully.\n",
                },
                "no-duplicate-agent-names",
                ".github/agents/reviewer.agent.md"
            )
        ).resolves.toEqual(["duplicateAgentName"]);
    });

    it("no-duplicate-slash-command-names reports prompt-skill name collisions", async () => {
        await expect(
            messageIdsFor(
                {
                    ".github/prompts/review.prompt.md":
                        "---\ndescription: Review changes\nname: review\n---\nReview the diff.\n",
                    ".github/skills/review/SKILL.md":
                        "---\nname: review\ndescription: Review changes thoroughly\n---\nUse the review checklist.\n",
                },
                "no-duplicate-slash-command-names",
                ".github/prompts/review.prompt.md"
            )
        ).resolves.toEqual(["duplicateSlashCommandName"]);
    });
});
