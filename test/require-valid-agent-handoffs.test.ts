import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-handoffs", () => {
    it("accepts valid handoffs with required metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    prompt: Implement the approved plan.\n    send: true\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports handoffs that omit a label", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - agent: Implementer\n    prompt: Implement the approved plan.\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingLabel",
        ]);
    });

    it("reports handoffs that omit a target agent", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    prompt: Implement the approved plan.\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingAgent",
        ]);
    });

    it("reports auto-send handoffs that omit a prompt", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoffs",
            text: "---\ndescription: Plan work carefully\nhandoffs:\n  - label: Start Implementation\n    agent: Implementer\n    send: true\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingPromptForAutoSend",
        ]);
    });
});
