import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-mcp-servers`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterList,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const formatMcpServersValue = (
    scalarValue: string | undefined,
    listValue: readonly string[] | undefined
): string => {
    if (scalarValue !== undefined) {
        return scalarValue;
    }

    if (listValue !== undefined) {
        return `[${listValue.join(", ")}]`;
    }

    return "(empty)";
};

const requireValidAgentMcpServersRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "mcp-servers")
            ) {
                return;
            }

            const mcpServers = getFrontmatterList(frontmatter, "mcp-servers");

            if (mcpServers !== undefined && mcpServers.length > 0) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    mcpServersValue: formatMcpServersValue(
                        getFrontmatterScalar(frontmatter, "mcp-servers"),
                        mcpServers
                    ),
                },
                messageId: "invalidMcpServersField",
            });
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: [
                "copilot.configs.recommended",
                "copilot.configs.strict",
                "copilot.configs.all",
            ],
            description:
                "require Copilot custom-agent `mcp-servers` metadata to be a non-empty list when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidMcpServersField:
                "Copilot custom agent `mcp-servers` metadata must be a non-empty list of MCP server config names (current value: `{{mcpServersValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-mcp-servers",
});

export default requireValidAgentMcpServersRule;
