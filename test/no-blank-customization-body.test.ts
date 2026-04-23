import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-blank-customization-body", () => {
    it("accepts prompt files with meaningful body content", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: Review the repository\nagent: ask\n---\nReview the repository for configuration drift and summarize the top risks.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports prompt files that only contain frontmatter and comments", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: Review the repository\nagent: ask\n---\n<!-- intentionally blank -->\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "blankBody",
        ]);
    });

    it("reports blank path-specific instructions files", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/typescript.instructions.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: TypeScript guidance\napplyTo: **/*.ts\n---\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "blankBody",
        ]);
    });

    it("ignores repository instructions because they are covered by a dedicated rule", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/copilot-instructions.md",
            ruleId: "no-blank-customization-body",
            text: "",
        });

        expect(messages).toHaveLength(0);
    });

    it("ignores .github/instructions/copilot-instructions.md because it is treated as repository instructions", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/copilot-instructions.md",
            ruleId: "no-blank-customization-body",
            text: "",
        });

        expect(messages).toHaveLength(0);
    });
});
