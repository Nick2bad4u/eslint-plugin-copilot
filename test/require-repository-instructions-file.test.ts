import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-repository-instructions-file", () => {
    it("accepts repositories that already define .github/copilot-instructions.md", async () => {
        const messages = await lintMarkdownRule({
            additionalFiles: {
                ".github/copilot-instructions.md":
                    "# Repository guidance\n\nKeep prompts concise.\n",
            },
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-repository-instructions-file",
            text: "---\ndescription: Review the repository\nmode: ask\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing repository-wide instructions when other Copilot assets exist", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-repository-instructions-file",
            text: "---\ndescription: Review the repository\nmode: ask\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingRepositoryInstructions",
        ]);
    });
});
