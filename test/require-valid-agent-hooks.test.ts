import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-hooks", () => {
    it("accepts command hooks with a default command", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hooks",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("accepts command hooks with only OS-specific commands", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hooks",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      windows: powershell -File scripts\\format.ps1\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports hooks with a non-command type", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hooks",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: prompt\n      command: ./scripts/format.sh\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHookType",
        ]);
    });

    it("reports command hooks that omit all command properties", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-valid-agent-hooks",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      cwd: scripts\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingHookCommand",
        ]);
    });
});
