import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-json-agent-mcp-servers`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const JSON_FILE_EXTENSION_PATTERN = /\.json$/iu;

const requireJsonAgentMcpServersRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const mcpServers =
                frontmatter === null
                    ? undefined
                    : getFrontmatterList(frontmatter, "mcp-servers");

            if (mcpServers === undefined) {
                return;
            }

            const invalidServer = mcpServers.find(
                (serverPath) =>
                    !JSON_FILE_EXTENSION_PATTERN.test(serverPath.trim())
            );

            if (invalidServer === undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    mcpServer: invalidServer,
                },
                messageId: "nonJsonAgentMcpServer",
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
                "require Copilot custom-agent `mcp-servers` entries to reference JSON config files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            nonJsonAgentMcpServer:
                "Copilot custom-agent `mcp-servers` entry `{{mcpServer}}` should reference a `.json` config file.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-json-agent-mcp-servers",
});

export default requireJsonAgentMcpServersRule;
