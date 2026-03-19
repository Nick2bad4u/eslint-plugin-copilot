import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-prompt-model", () => {
    it("accepts non-empty scalar prompt model names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: "---\ndescription: Review changes\nagent: plan\nmodel: GPT-5 (copilot)\n---\nReview the requested changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports empty prompt model values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: "---\ndescription: Review changes\nagent: plan\nmodel:\n---\nReview the requested changes.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptModel",
        ]);
    });

    it("reports prompt model lists", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: "---\ndescription: Review changes\nagent: plan\nmodel: ['Claude Haiku 4.5 (copilot)', 'GPT-5 (copilot)']\n---\nReview the requested changes.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptModel",
        ]);
    });

    it("reports empty prompt model list literals", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: "---\ndescription: Review changes\nagent: plan\nmodel: []\n---\nReview the requested changes.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidPromptModel",
        ]);
    });
});
