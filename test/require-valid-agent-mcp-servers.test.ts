import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-mcp-servers", () => {
    it("accepts non-empty mcp-servers lists", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: "---\ndescription: Coordinate release automation\ntarget: github-copilot\nmcp-servers: ['release-coordinator.json', 'observability.json']\n---\nCoordinate release tasks through MCP servers.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports empty mcp-servers values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: "---\ndescription: Coordinate release automation\nmcp-servers:\n---\nCoordinate release tasks through MCP servers.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidMcpServersField",
        ]);
    });

    it("reports scalar mcp-servers values", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: "---\ndescription: Coordinate release automation\nmcp-servers: release-coordinator.json\n---\nCoordinate release tasks through MCP servers.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidMcpServersField",
        ]);
    });

    it("reports empty mcp-servers lists", async () => {
        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: "---\ndescription: Coordinate release automation\nmcp-servers: []\n---\nCoordinate release tasks through MCP servers.\n",
        });

        expect(messages.map((message) => message.messageId)).toEqual([
            "invalidMcpServersField",
        ]);
    });
});
