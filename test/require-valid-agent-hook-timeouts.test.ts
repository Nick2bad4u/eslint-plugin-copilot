import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-hook-timeouts", () => {
    it("accepts numeric hook timeout values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hook-timeouts",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n      timeout: 15\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports non-numeric hook timeout values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hook-timeouts",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n      timeout: soon\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHookTimeout",
        ]);
    });
});
