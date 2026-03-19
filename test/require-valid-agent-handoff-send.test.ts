import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-handoff-send", () => {
    it("accepts boolean handoff send values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoff-send",
            text: "---\ndescription: Plan implementation work\nhandoffs:\n  - label: Start Implementation\n    agent: implementation\n    prompt: Implement the approved plan.\n    send: true\n---\nPlan work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts mixed-case boolean handoff send values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoff-send",
            text: "---\ndescription: Plan implementation work\nhandoffs:\n  - label: Start Implementation\n    agent: implementation\n    send: False\n---\nPlan work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports invalid handoff send values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-handoff-send",
            text: "---\ndescription: Plan implementation work\nhandoffs:\n  - label: Start Implementation\n    agent: implementation\n    send: later\n---\nPlan work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHandoffSend",
        ]);
    });
});
