import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-handoffs", () => {
    it("accepts valid handoffs with required metadata", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    prompt: Implement the approved plan.\n    send: true\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it.each([
        {
            expectedMessageId: "missingLabel",
            name: "reports handoffs that omit a label",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - agent: Implementer\n    prompt: Implement the approved plan.\n---\nPlan the requested change before implementation.\n",
        },
        {
            expectedMessageId: "missingAgent",
            name: "reports handoffs that omit a target agent",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    prompt: Implement the approved plan.\n---\nPlan the requested change before implementation.\n",
        },
        {
            expectedMessageId: "missingPromptForAutoSend",
            name: "reports auto-send handoffs that omit a prompt",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    send: true\n---\nPlan the requested change before implementation.\n",
        },
    ])("$name", async ({ expectedMessageId, text }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text,
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            expectedMessageId,
        ]);
    });
});
