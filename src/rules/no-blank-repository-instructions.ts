/**
 * @packageDocumentation
 * ESLint rule implementation for `no-blank-repository-instructions`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
import {
    extractFrontmatter,
    getMeaningfulMarkdownBody,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const noBlankRepositoryInstructionsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (
                getCopilotFileKind(context.filename) !==
                "repository-instructions"
            ) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const body = getMeaningfulMarkdownBody(
                frontmatter?.body ?? context.sourceCode.text
            );

            if (body.length > 0) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "blankInstructions",
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
                "disallow empty repository-wide Copilot instructions files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            blankInstructions:
                "Repository-wide Copilot instructions should contain actionable Markdown guidance instead of being blank.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-blank-repository-instructions",
});

export default noBlankRepositoryInstructionsRule;
