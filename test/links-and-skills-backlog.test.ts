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

describe("link and skill backlog rules", () => {
    it("require-relative-agent-links reports absolute file links", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-relative-agent-links",
            text: "---\ndescription: Review code\n---\nSee [guide](/docs/review.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "nonRelativeAgentLink",
        ]);
    });

    it("require-relative-instructions-links reports absolute file links", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/frontend.instructions.md",
            ruleId: "require-relative-instructions-links",
            text: "---\ndescription: Frontend rules\napplyTo: src/**/*.ts\n---\nSee [guide](/docs/frontend.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "nonRelativeInstructionsLink",
        ]);
    });

    it("require-existing-relative-prompt-links reports missing prompt targets", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-existing-relative-prompt-links",
            text: "---\ndescription: Review changes\n---\nSee [guide](../docs/review.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingPromptLinkTarget",
        ]);
    });

    it("require-existing-relative-agent-links reports missing agent targets", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-existing-relative-agent-links",
            text: "---\ndescription: Review code\n---\nSee [guide](../../docs/review.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingAgentLinkTarget",
        ]);
    });

    it("require-existing-relative-instructions-links reports missing instruction targets", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/frontend.instructions.md",
            ruleId: "require-existing-relative-instructions-links",
            text: "---\ndescription: Frontend rules\napplyTo: src/**/*.ts\n---\nSee [guide](../../docs/frontend.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingInstructionsLinkTarget",
        ]);
    });

    it("require-skill-file-location reports misplaced SKILL.md files", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: "docs/SKILL.md",
            ruleId: "require-skill-file-location",
            text: "---\nname: review-skill\ndescription: Review code\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidSkillLocation",
        ]);
    });

    it("require-skill-file-metadata reports missing name metadata", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-skill-file-metadata",
            text: "---\ndescription: Review code\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingSkillName",
        ]);
    });

    it("no-blank-skill-body reports blank skill instructions", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "no-blank-skill-body",
            text: "---\nname: review\ndescription: Review code\n---\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "blankSkillBody",
        ]);
    });

    it("require-valid-skill-name reports non-hyphenated identifiers", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-valid-skill-name",
            text: "---\nname: Review Skill\ndescription: Review code\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidSkillName",
        ]);
    });

    it("require-valid-skill-directory-name reports non-hyphenated directory names", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/Review Skill/SKILL.md",
            ruleId: "require-valid-skill-directory-name",
            text: "---\nname: review-skill\ndescription: Review code\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidSkillDirectoryName",
        ]);
    });

    it("require-skill-name-match-directory reports mismatched names", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-skill-name-match-directory",
            text: "---\nname: review-security\ndescription: Review code\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "skillNameDoesNotMatchDirectory",
        ]);
    });

    it("require-valid-skill-license reports blank license metadata", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-valid-skill-license",
            text: "---\nname: review\ndescription: Review code\nlicense:\n---\nReview code carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidSkillLicense",
        ]);
    });

    it("require-relative-skill-links reports absolute file links", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-relative-skill-links",
            text: "---\nname: review\ndescription: Review code\n---\nSee [guide](/docs/review.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "nonRelativeSkillLink",
        ]);
    });

    it("require-existing-relative-skill-links reports missing skill targets", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/skills/review/SKILL.md",
            ruleId: "require-existing-relative-skill-links",
            text: "---\nname: review\ndescription: Review code\n---\nSee [guide](guide.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingSkillLinkTarget",
        ]);
    });

    it("no-duplicate-skill-names reports duplicate skill identifiers", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                {
                    ".claude/skills/review-clone/SKILL.md":
                        "---\nname: review\ndescription: Review code in Claude flows\n---\nReview code carefully.\n",
                    ".github/skills/review/SKILL.md":
                        "---\nname: review\ndescription: Review code\n---\nReview code carefully.\n",
                },
                "no-duplicate-skill-names",
                ".github/skills/review/SKILL.md"
            )
        ).resolves.toStrictEqual(["duplicateSkillName"]);
    });

    it("require-skill-md-filename reports skill-definition markdown with the wrong file name", async () => {
        expect.hasAssertions();
        await expect(
            messageIdsFor(
                {
                    ".github/skills/review/README.md":
                        "---\nname: review\ndescription: Review code\n---\nReview code carefully.\n",
                },
                "require-skill-md-filename",
                ".github/skills/review/README.md"
            )
        ).resolves.toStrictEqual(["invalidSkillDefinitionFilename"]);
    });
});
