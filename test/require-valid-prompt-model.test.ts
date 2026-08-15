import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-prompt-model", () => {
    it("accepts non-empty scalar prompt model names", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: "---\ndescription: Review changes\nagent: plan\nmodel: GPT-5 (copilot)\n---\nReview the requested changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it.each([
        {
            name: "reports empty prompt model values",
            value: "",
        },
        {
            name: "reports prompt model lists",
            value: " ['Claude Haiku 4.5 (copilot)', 'GPT-5 (copilot)']",
        },
        {
            name: "reports empty prompt model list literals",
            value: " []",
        },
    ])("$name", async ({ value }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-valid-prompt-model",
            text: `---\ndescription: Review changes\nagent: plan\nmodel:${value}\n---\nReview the requested changes.\n`,
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidPromptModel",
        ]);
    });
});
