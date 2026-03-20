import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-github-copilot-target-for-mcp-servers`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireGithubCopilotTargetForMcpServersRule: CopilotRuleModule =
    createCopilotRule({
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

                const target = getFrontmatterScalar(frontmatter, "target");

                if (target === "github-copilot") {
                    return;
                }

                if (target === undefined) {
                    reportAtDocumentStart(context, {
                        messageId: hasFrontmatterField(frontmatter, "target")
                            ? "emptyTarget"
                            : "missingTarget",
                    });

                    return;
                }

                reportAtDocumentStart(context, {
                    data: { target },
                    messageId: "invalidTarget",
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
                    "require custom agents that declare `mcp-servers` to set `target: github-copilot`.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                emptyTarget:
                    "Copilot custom agent files that declare `mcp-servers` must define a non-empty `target: github-copilot` frontmatter value.",
                invalidTarget:
                    "Copilot custom agent files that declare `mcp-servers` must set `target: github-copilot` (current target: `{{target}}`).",
                missingTarget:
                    "Copilot custom agent files that declare `mcp-servers` must also declare `target: github-copilot`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-github-copilot-target-for-mcp-servers",
    });

export default requireGithubCopilotTargetForMcpServersRule;
