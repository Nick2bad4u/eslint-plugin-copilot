import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-blank-customization-body", () => {
    it.each([
        {
            expectedMessageIds: [],
            filePath: ".github/prompts/review.prompt.md",
            name: "accepts prompt files with meaningful body content",
            text: "---\ndescription: Review the repository\nagent: ask\n---\nReview the repository for configuration drift and summarize the top risks.\n",
        },
        {
            expectedMessageIds: ["blankBody"],
            filePath: ".github/prompts/review.prompt.md",
            name: "reports prompt files that only contain frontmatter and comments",
            text: "---\ndescription: Review the repository\nagent: ask\n---\n<!-- intentionally blank -->\n",
        },
        {
            expectedMessageIds: ["blankBody"],
            filePath: ".github/instructions/typescript.instructions.md",
            name: "reports blank path-specific instructions files",
            text: "---\ndescription: TypeScript guidance\napplyTo: **/*.ts\n---\n",
        },
        {
            expectedMessageIds: [],
            filePath: ".github/copilot-instructions.md",
            name: "ignores repository instructions because they are covered by a dedicated rule",
            text: "",
        },
        {
            expectedMessageIds: [],
            filePath: ".github/instructions/copilot-instructions.md",
            name: "ignores .github/instructions/copilot-instructions.md because it is treated as repository instructions",
            text: "",
        },
    ])("$name", async ({ expectedMessageIds, filePath, text }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath,
            ruleId: "no-blank-customization-body",
            text,
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual(
            expectedMessageIds
        );
    });
});
