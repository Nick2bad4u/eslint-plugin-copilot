import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-valid-agent-mcp-servers", () => {
    it("accepts non-empty mcp-servers lists", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: "---\ndescription: Coordinate release automation\ntarget: github-copilot\nmcp-servers: ['release-coordinator.json', 'observability.json']\n---\nCoordinate release tasks through MCP servers.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it.each([
        {
            name: "reports empty mcp-servers values",
            value: "",
        },
        {
            name: "reports scalar mcp-servers values",
            value: " release-coordinator.json",
        },
        {
            name: "reports empty mcp-servers lists",
            value: " []",
        },
    ])("$name", async ({ value }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/agents/release.agent.md",
            ruleId: "require-valid-agent-mcp-servers",
            text: `---\ndescription: Coordinate release automation\nmcp-servers:${value}\n---\nCoordinate release tasks through MCP servers.\n`,
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "invalidMcpServersField",
        ]);
    });
});
