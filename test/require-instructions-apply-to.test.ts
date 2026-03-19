import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-instructions-apply-to", () => {
    it("accepts a valid instructions file with applyTo metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/frontend.instructions.md",
            ruleId: "require-instructions-apply-to",
            text: '---\ndescription: Frontend rules\napplyTo: "src/frontend/**/*.ts"\n---\nUse explicit return types for exported helpers.\n',
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing applyTo metadata", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/instructions/frontend.instructions.md",
            ruleId: "require-instructions-apply-to",
            text: "---\ndescription: Frontend rules\n---\nUse explicit return types for exported helpers.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingApplyTo",
        ]);
    });
});
