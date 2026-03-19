import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("prefer-qualified-tools", () => {
    it("accepts fully-qualified tool names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "prefer-qualified-tools",
            text: "---\ndescription: Review the repository\nmode: agent\ntools: [search/file_search, search/read_file]\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports legacy unqualified tool names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "prefer-qualified-tools",
            text: "---\ndescription: Review the repository\nmode: agent\ntools: [file_search, search/read_file]\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "preferQualifiedTool",
        ]);
    });
});
