import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-prompt-argument-hint`.
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

const requireValidPromptArgumentHintRule: CopilotRuleModule = createCopilotRule(
    {
        create(context) {
            return createMarkdownDocumentListener(() => {
                if (getCopilotFileKind(context.filename) !== "prompt") {
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
                    getFrontmatterScalar(frontmatter, "argument-hint") !==
                    undefined
                ) {
                    return;
                }

                reportAtDocumentStart(context, {
                    messageId: "invalidPromptArgumentHint",
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
                    "require Copilot prompt-file `argument-hint` metadata to be a non-empty scalar when present.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidPromptArgumentHint:
                    "Copilot prompt-file `argument-hint` metadata must be a non-empty scalar when present.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-prompt-argument-hint",
    }
);

export default requireValidPromptArgumentHintRule;
