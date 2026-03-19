import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-deprecated-agent-infer", () => {
    it("accepts a custom agent file without deprecated infer metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "no-deprecated-agent-infer",
            text: "---\ndescription: Plan multi-step implementation work\nuser-invocable: true\ndisable-model-invocation: false\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports deprecated infer metadata in custom agent files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "no-deprecated-agent-infer",
            text: "---\ndescription: Plan multi-step implementation work\ninfer: false\n---\nPlan the work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "deprecatedInfer",
        ]);
    });

    it("ignores deprecated infer metadata outside custom agent files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "no-deprecated-agent-infer",
            text: "---\ndescription: Review the repository\nagent: ask\ninfer: false\n---\nReview the repository for customization drift.\n",
        });

        expect(messages).toHaveLength(0);
    });
});
