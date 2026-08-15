import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-tools", () => {
    it("accepts non-empty custom-agent tool lists", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: "---\ndescription: Review implementation quality\ntools: ['search/codebase', 'fetch/web']\n---\nReview the implementation carefully.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it.each([
        {
            name: "reports empty custom-agent tools values",
            value: "",
        },
        {
            name: "reports scalar custom-agent tools values",
            value: " search/codebase",
        },
        {
            name: "reports empty custom-agent tools lists",
            value: " []",
        },
    ])("$name", async ({ value }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/reviewer.agent.md",
            ruleId: "require-valid-agent-tools",
            text: `---\ndescription: Review implementation quality\ntools:${value}\n---\nReview the implementation carefully.\n`,
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidAgentTools",
        ]);
    });
});
