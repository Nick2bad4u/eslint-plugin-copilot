/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-prompt-argument-hint`.
 */
import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
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

/** Rule module for `require-valid-prompt-argument-hint`. */
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
                    isDefined(
                        getFrontmatterScalar(frontmatter, "argument-hint")
                    )
                ) {
                    return;
                }

                reportAtDocumentStart(context, {
                    messageId: "invalidPromptArgumentHint",
                });
            });
        },
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
                url: createRuleDocsUrl("require-valid-prompt-argument-hint"),
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
