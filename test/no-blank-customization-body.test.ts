import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-blank-customization-body", () => {
    it("accepts prompt files with meaningful body content", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: Review the repository\nagent: ask\n---\nReview the repository for configuration drift and summarize the top risks.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports prompt files that only contain frontmatter and comments", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: Review the repository\nagent: ask\n---\n<!-- intentionally blank -->\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "blankBody",
        ]);
    });

    it("reports blank path-specific instructions files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/typescript.instructions.md",
            ruleId: "no-blank-customization-body",
            text: "---\ndescription: TypeScript guidance\napplyTo: **/*.ts\n---\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "blankBody",
        ]);
    });

    it("ignores repository instructions because they are covered by a dedicated rule", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/copilot-instructions.md",
            ruleId: "no-blank-customization-body",
            text: "",
        });

        expect(messages).toHaveLength(0);
    });
});
