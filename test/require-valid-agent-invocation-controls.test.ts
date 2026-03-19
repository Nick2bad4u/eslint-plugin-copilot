import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-invocation-controls", () => {
    it("accepts documented boolean invocation-control values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-invocation-controls",
            text: "---\ndescription: Plan work before implementation starts\nuser-invocable: false\ndisable-model-invocation: true\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts mixed-case boolean tokens", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-invocation-controls",
            text: "---\ndescription: Plan work before implementation starts\nuser-invocable: False\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports invalid invocation-control values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-invocation-controls",
            text: "---\ndescription: Plan work before implementation starts\nuser-invocable: sometimes\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidInvocationControl",
        ]);
    });

    it("reports empty invocation-control values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-invocation-controls",
            text: "---\ndescription: Plan work before implementation starts\ndisable-model-invocation:\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidInvocationControl",
        ]);
    });
});
