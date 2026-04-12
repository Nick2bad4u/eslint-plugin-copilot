import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("no-blank-repository-instructions", () => {
    it("accepts repository instructions with meaningful body text", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/copilot-instructions.md",
            ruleId: "no-blank-repository-instructions",
            text: "# Repository guidance\n\n- Run tests before proposing changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts repository instructions in .github/instructions/ with meaningful body text", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/copilot-instructions.md",
            ruleId: "no-blank-repository-instructions",
            text: "# Repository guidance\n\n- Run tests before proposing changes.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports blank repository instructions", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/copilot-instructions.md",
            ruleId: "no-blank-repository-instructions",
            text: "<!-- placeholder -->\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "blankInstructions",
        ]);
    });

    it("reports blank repository instructions in .github/instructions/", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/copilot-instructions.md",
            ruleId: "no-blank-repository-instructions",
            text: "<!-- placeholder -->\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "blankInstructions",
        ]);
    });
});
