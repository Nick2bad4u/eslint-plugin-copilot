import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-tools", () => {
    it("accepts non-empty custom-agent tool lists", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: "---\ndescription: Review implementation quality\ntools: ['search/codebase', 'fetch/web']\n---\nReview the implementation carefully.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports empty custom-agent tools values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: "---\ndescription: Review implementation quality\ntools:\n---\nReview the implementation carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentTools",
        ]);
    });

    it("reports scalar custom-agent tools values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: "---\ndescription: Review implementation quality\ntools: search/codebase\n---\nReview the implementation carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentTools",
        ]);
    });

    it("reports empty custom-agent tools lists", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: "---\ndescription: Review implementation quality\ntools: []\n---\nReview the implementation carefully.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentTools",
        ]);
    });
});
