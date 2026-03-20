import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-existing-agent-mcp-servers`.
 */
import {
    findRepositoryRoot,
    isCustomAgentFilePath,
} from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    pathExists,
    resolveRepositoryRelativePath,
} from "../_internal/file-system.js";
import {
    extractFrontmatter,
    getFrontmatterList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireExistingAgentMcpServersRule: CopilotRuleModule = createCopilotRule(
    {
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

                const repositoryRoot = findRepositoryRoot(context.filename);
                const missingServer = mcpServers.find(
                    (serverPath) =>
                        !pathExists(
                            resolveRepositoryRelativePath(
                                repositoryRoot,
                                serverPath
                            )
                        )
                );

                if (missingServer === undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        mcpServer: missingServer,
                    },
                    messageId: "missingAgentMcpServer",
                });
            });
        },
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require Copilot custom-agent `mcp-servers` entries to resolve to existing repository files.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                missingAgentMcpServer:
                    "Copilot custom-agent `mcp-servers` entry `{{mcpServer}}` does not resolve to an existing repository file.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-existing-agent-mcp-servers",
    }
);

export default requireExistingAgentMcpServersRule;
