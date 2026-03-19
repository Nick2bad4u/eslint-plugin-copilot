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
});
