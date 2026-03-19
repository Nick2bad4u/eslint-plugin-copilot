import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-target", () => {
    it("accepts documented custom-agent target values", async () => {
        const vscodeMessages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-target",
            text: "---\ndescription: Plan work inside VS Code\ntarget: vscode\n---\nPlan work before implementation starts.\n",
        });
        const githubMessages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-target",
            text: "---\ndescription: Plan work for GitHub Copilot\ntarget: github-copilot\n---\nPlan work before implementation starts.\n",
        });

        expect(vscodeMessages).toHaveLength(0);
        expect(githubMessages).toHaveLength(0);
    });

    it("reports invalid custom-agent target values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-target",
            text: "---\ndescription: Plan work inside VS Code\ntarget: github\n---\nPlan work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidTarget",
        ]);
    });

    it("reports empty target values when the field is present", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-target",
            text: "---\ndescription: Plan work inside VS Code\ntarget:\n---\nPlan work before implementation starts.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "emptyTarget",
        ]);
    });

    it("defers to the mcp-target rule when mcp-servers are declared", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/planner.agent.md",
            ruleId: "require-valid-agent-target",
            text: "---\ndescription: Plan work for GitHub Copilot\ntarget: github\nmcp-servers: [local-dev]\n---\nPlan work before implementation starts.\n",
        });

        expect(messages).toHaveLength(0);
    });
});
