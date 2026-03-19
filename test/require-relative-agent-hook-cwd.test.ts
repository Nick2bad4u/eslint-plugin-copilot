import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-relative-agent-hook-cwd", () => {
    it("accepts repository-relative cwd values for agent hooks", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-relative-agent-hook-cwd",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n      cwd: scripts/hooks\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports absolute hook cwd values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-relative-agent-hook-cwd",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n      cwd: C:\\hooks\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHookCwd",
        ]);
    });

    it("reports empty hook cwd values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/formatter.agent.md",
            ruleId: "require-relative-agent-hook-cwd",
            text: "---\ndescription: Format files after editing\nhooks:\n  PostToolUse:\n    - type: command\n      command: ./scripts/format.sh\n      cwd:\n---\nFormat edited files after tool usage.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidHookCwd",
        ]);
    });
});
