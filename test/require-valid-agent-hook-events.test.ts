import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-hook-events", () => {
    it("accepts supported agent hook events", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hook-events",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n  SubagentStart:\n    - type: command\n      command: ./scripts/log-subagent.sh\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports unsupported agent hook event names", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hook-events",
            text: "---\ndescription: Format files after editing\nhooks:\n  AfterEdit:\n    - type: command\n      command: ./scripts/format.sh\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHookEvent",
        ]);
    });
});
