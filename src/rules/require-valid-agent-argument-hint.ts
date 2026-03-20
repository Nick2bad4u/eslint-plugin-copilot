import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-argument-hint`.
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

const requireValidAgentArgumentHintRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "argument-hint")
            ) {
                return;
            }

            if (
                getFrontmatterScalar(frontmatter, "argument-hint") !== undefined
            ) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "invalidAgentArgumentHint",
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
                "require Copilot custom-agent `argument-hint` metadata to be a non-empty scalar when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidAgentArgumentHint:
                "Copilot custom-agent `argument-hint` metadata must be a non-empty scalar when present.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-argument-hint",
});

export default requireValidAgentArgumentHintRule;
