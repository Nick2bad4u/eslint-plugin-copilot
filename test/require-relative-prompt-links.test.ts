import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-relative-prompt-links", () => {
    it("accepts relative workspace links in prompt files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-relative-prompt-links",
            text: "---\ndescription: Review changes with repository guidance\nagent: agent\n---\nReview the proposed changes using [security guidance](../instructions/security.instructions.md).\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("ignores external links and heading anchors", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-relative-prompt-links",
            text: "---\ndescription: Review changes with repository guidance\nagent: agent\n---\nSee [VS Code docs](https://code.visualstudio.com/docs/copilot/customization/prompt-files) and [the checklist](#review-checklist).\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports root-relative workspace links", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-relative-prompt-links",
            text: "---\ndescription: Review changes with repository guidance\nagent: agent\n---\nReview the proposed changes using [security guidance](/.github/instructions/security.instructions.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "nonRelativePromptLink",
        ]);
    });

    it("reports file URI links to workspace files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-relative-prompt-links",
            text: "---\ndescription: Review changes with repository guidance\nagent: agent\n---\nReview the proposed changes using [security guidance](file:///C:/repo/.github/instructions/security.instructions.md).\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "nonRelativePromptLink",
        ]);
    });
});
