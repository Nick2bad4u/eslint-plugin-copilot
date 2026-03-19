import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-prompt-file-metadata", () => {
    it("accepts a valid agent prompt file", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-prompt-file-metadata",
            text: "---\ndescription: Review the repository\nmode: agent\ntools: [search/file_search, search/read_file]\n---\nReview the repository for stale configuration and docs drift.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("requires tools when prompt mode is agent", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-prompt-file-metadata",
            text: "---\ndescription: Review the repository\nmode: agent\n---\nReview the repository for stale configuration and docs drift.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingTools",
        ]);
    });
});
