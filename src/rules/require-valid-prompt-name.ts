import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-prompt-name`.
 */
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

const requireValidPromptNameRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "prompt") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "name")
            ) {
                return;
            }

            if (getFrontmatterScalar(frontmatter, "name") !== undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "invalidPromptName",
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
                "require Copilot prompt-file `name` metadata to be a non-empty scalar when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidPromptName:
                "Copilot prompt-file `name` metadata must be a non-empty scalar when present.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-prompt-name",
});

export default requireValidPromptNameRule;
