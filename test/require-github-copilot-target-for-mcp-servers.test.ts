import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-github-copilot-target-for-mcp-servers", () => {
    it("accepts custom agents that use mcp-servers with the github-copilot target", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-github-copilot-target-for-mcp-servers",
            text: "---\ndescription: Coordinate release work with GitHub Copilot MCP servers\ntarget: github-copilot\nmcp-servers: [release-coordinator.json]\n---\nCoordinate release automation tasks.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing target metadata when mcp-servers is declared", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-github-copilot-target-for-mcp-servers",
            text: "---\ndescription: Coordinate release work with GitHub Copilot MCP servers\nmcp-servers: [release-coordinator.json]\n---\nCoordinate release automation tasks.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "missingTarget",
        ]);
    });

    it("reports invalid non-GitHub-Copilot targets when mcp-servers is declared", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-github-copilot-target-for-mcp-servers",
            text: "---\ndescription: Coordinate release work with GitHub Copilot MCP servers\ntarget: vscode\nmcp-servers: [release-coordinator.json]\n---\nCoordinate release automation tasks.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidTarget",
        ]);
    });
});
