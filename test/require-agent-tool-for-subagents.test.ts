import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-agent-tool-for-subagents", () => {
    it("accepts a custom agent that declares subagents and includes the agent tool", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-agent-tool-for-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\ntools: [agent]\nagents: [Researcher, Implementer]\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing tools metadata when subagents are declared", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-agent-tool-for-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\nagents: [Researcher, Implementer]\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingTools",
        ]);
    });

    it("reports tools lists that omit the agent tool when subagents are declared", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-agent-tool-for-subagents",
            text: "---\ndescription: Build features by delegating to specialist agents\ntools: [search/codebase, fetch/fetch]\nagents: [Researcher, Implementer]\n---\nResearch first, then delegate implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingAgentTool",
        ]);
    });

    it("does not require the agent tool when subagent use is explicitly disabled", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/feature-builder.agent.md",
            ruleId: "require-agent-tool-for-subagents",
            text: "---\ndescription: Build features without subagent delegation\nagents: []\n---\nStay in the current agent only.\n",
        });

        expect(messages).toHaveLength(0);
    });
});
