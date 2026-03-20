import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `prefer-custom-instructions-under-code-review-limit`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const CODE_REVIEW_CUSTOM_INSTRUCTIONS_LIMIT = 4000;

const preferCustomInstructionsUnderCodeReviewLimitRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return createMarkdownDocumentListener(() => {
                const fileKind = getCopilotFileKind(context.filename);

                if (
                    fileKind !== "instructions" &&
                    fileKind !== "repository-instructions"
                ) {
                    return;
                }

                const characterCount = context.sourceCode.text.length;

                if (characterCount <= CODE_REVIEW_CUSTOM_INSTRUCTIONS_LIMIT) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        characterCount: String(characterCount),
                        maxCharacters: String(
                            CODE_REVIEW_CUSTOM_INSTRUCTIONS_LIMIT
                        ),
                    },
                    messageId: "exceedsCodeReviewLimit",
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
                    "enforce repository and path-specific Copilot instruction files staying within the 4,000-character code-review instruction budget.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                exceedsCodeReviewLimit:
                    "Copilot code review only reads roughly the first {{maxCharacters}} characters of custom instructions; this file is {{characterCount}} characters long.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "prefer-custom-instructions-under-code-review-limit",
    });

export default preferCustomInstructionsUnderCodeReviewLimitRule;
