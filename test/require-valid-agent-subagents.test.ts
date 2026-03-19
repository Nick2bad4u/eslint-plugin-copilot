import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-subagents", () => {
    it("accepts explicit lists of allowed subagents", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-valid-agent-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: [Researcher, Implementer]\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts the wildcard and explicit empty-array forms", async () => {
        const wildcardMessages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-valid-agent-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: '*'\n---\nResearch first, then delegate implementation.\n",
        });
        const emptyArrayMessages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-valid-agent-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: []\n---\nResearch first, then delegate implementation.\n",
        });

        expect(wildcardMessages).toHaveLength(0);
        expect(emptyArrayMessages).toHaveLength(0);
    });

    it("reports scalar agents values that are not the wildcard", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-valid-agent-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: Researcher\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentsField",
        ]);
    });

    it("reports wildcard entries embedded inside an agents list", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-valid-agent-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: ['*', Researcher]\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidAgentsField",
        ]);
    });
});
