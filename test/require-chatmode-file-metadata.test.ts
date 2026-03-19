import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-chatmode-file-metadata", () => {
    it("accepts a legacy chat mode file with description metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/chatmodes/plan.chatmode.md",
            ruleId: "require-chatmode-file-metadata",
            text: "---\ndescription: Generate a plan for a multi-step repository change\ntools: [search/codebase]\n---\nPlan the next implementation step.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts a custom agent file with description metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-chatmode-file-metadata",
            text: "---\ndescription: Generate a plan for a multi-step repository change\ntools: [search/codebase]\n---\nPlan the next implementation step.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing description metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/chatmodes/plan.chatmode.md",
            ruleId: "require-chatmode-file-metadata",
            text: "---\ntools: [search/codebase]\n---\nPlan the next implementation step.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingDescription",
        ]);
    });
});
