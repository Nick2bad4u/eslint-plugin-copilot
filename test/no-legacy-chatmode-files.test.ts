import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-legacy-chatmode-files", () => {
    it("reports legacy chatmode files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/chatmodes/planner.chatmode.md",
            ruleId: "no-legacy-chatmode-files",
            text: "---\ndescription: Plan work carefully\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "legacyChatmodeFile",
        ]);
    });

    it("ignores modern custom agent files", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "no-legacy-chatmode-files",
            text: "---\ndescription: Plan work carefully\n---\nPlan the requested change before implementation.\n",
        });

        expect(messages).toHaveLength(0);
    });
});
