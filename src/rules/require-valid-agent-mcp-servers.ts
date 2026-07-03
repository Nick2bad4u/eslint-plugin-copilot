import { arrayJoin, isDefined } from "ts-extras";

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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const formatMcpServersValue = (
    scalarValue: string | undefined,
    listValue: readonly string[] | undefined
): string => {
    if (isDefined(scalarValue)) {
        return scalarValue;
    }

    if (isDefined(listValue)) {
        return `[${arrayJoin(listValue, ", ")}]`;
    }

    return "(empty)";
};

/** Rule module for `require-valid-agent-mcp-servers`. */
const requireValidAgentMcpServersRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
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

            if (isDefined(mcpServers) && mcpServers.length > 0) {
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
        }),
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
            url: createRuleDocsUrl("require-valid-agent-mcp-servers"),
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
