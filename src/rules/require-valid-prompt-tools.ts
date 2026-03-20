import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-prompt-tools`.
 */
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

const requireValidPromptToolsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "prompt") {
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
                messageId: "invalidPromptTools",
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
                "require Copilot prompt-file `tools` metadata to be a non-empty list of tool or tool-set names when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidPromptTools:
                "Copilot prompt-file `tools` metadata must be a non-empty list of tool or tool-set names when present (current value: `{{toolsValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-prompt-tools",
});

export default requireValidPromptToolsRule;
