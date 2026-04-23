import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-model", () => {
    it("accepts a non-empty scalar model name", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/implementer.agent.md",
            ruleId: "require-valid-agent-model",
            text: "---\ndescription: Implement approved changes\nmodel: GPT-5 (copilot)\n---\nImplement the requested changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts a non-empty model priority list", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/implementer.agent.md",
            ruleId: "require-valid-agent-model",
            text: "---\ndescription: Implement approved changes\nmodel: ['Claude Haiku 4.5 (copilot)', 'GPT-5 (copilot)']\n---\nImplement the requested changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports empty model values", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/implementer.agent.md",
            ruleId: "require-valid-agent-model",
            text: "---\ndescription: Implement approved changes\nmodel:\n---\nImplement the requested changes.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidAgentModel",
        ]);
    });

    it("reports empty model lists", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/implementer.agent.md",
            ruleId: "require-valid-agent-model",
            text: "---\ndescription: Implement approved changes\nmodel: []\n---\nImplement the requested changes.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidAgentModel",
        ]);
    });
});
