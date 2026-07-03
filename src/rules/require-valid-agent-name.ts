import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-name`.
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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-valid-agent-name`. */
const requireValidAgentNameRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "name")
            ) {
                return;
            }

            if (isDefined(getFrontmatterScalar(frontmatter, "name"))) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "invalidAgentName",
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
                "require Copilot custom-agent `name` metadata to be a non-empty scalar when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-agent-name"),
        },
        messages: {
            invalidAgentName:
                "Copilot custom-agent `name` metadata must be a non-empty scalar when present.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-name",
});

export default requireValidAgentNameRule;
