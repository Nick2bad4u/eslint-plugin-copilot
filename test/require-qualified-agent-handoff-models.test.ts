import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-qualified-agent-handoff-models", () => {
    it("accepts qualified handoff model names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-qualified-agent-handoff-models",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    model: GPT-5 (copilot)\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports unqualified handoff model names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-qualified-agent-handoff-models",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    model: GPT-5\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "unqualifiedHandoffModel",
        ]);
    });
});
