/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-tools`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
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

const formatToolsValue = (
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

const requireValidAgentToolsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "tools")
            ) {
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            if (tools !== undefined && tools.length > 0) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    toolsValue: formatToolsValue(
                        getFrontmatterScalar(frontmatter, "tools"),
                        tools
                    ),
                },
                messageId: "invalidAgentTools",
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
                "require Copilot custom-agent `tools` metadata to be a non-empty list of tool or tool-set names when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidAgentTools:
                "Copilot custom agent `tools` metadata must be a non-empty list of tool or tool-set names when present (current value: `{{toolsValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-tools",
});

export default requireValidAgentToolsRule;
