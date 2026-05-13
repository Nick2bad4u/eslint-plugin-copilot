import { arrayJoin, isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-prompt-model`.
 */
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const INLINE_LIST_LITERAL_PATTERN = /^\s*\[.*\]\s*$/v;

const formatPromptModelValue = (
    scalarValue: string | undefined,
    listValue: readonly string[] | undefined
): string => {
    if (isDefined(scalarValue)) {
        return scalarValue;
    }

    if (isDefined(listValue)) {
        return `[${arrayJoin(listValue, ", ")}]`;
    }

    return "(empty)";
};

/** Rule module for `require-valid-prompt-model`. */
const requireValidPromptModelRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "prompt") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "model")
            ) {
                return;
            }

            const modelList = getFrontmatterList(frontmatter, "model");

            if (isDefined(modelList)) {
                reportAtDocumentStart(context, {
                    data: {
                        modelValue: formatPromptModelValue(
                            undefined,
                            modelList
                        ),
                    },
                    messageId: "invalidPromptModel",
                });
                return;
            }

            const model = getFrontmatterScalar(frontmatter, "model");

            if (
                isDefined(model) &&
                model.length > 0 &&
                !INLINE_LIST_LITERAL_PATTERN.test(model)
            ) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    modelValue: formatPromptModelValue(model, modelList),
                },
                messageId: "invalidPromptModel",
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
                "require Copilot prompt-file `model` metadata to be a non-empty single model name when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-prompt-model"),
        },
        messages: {
            invalidPromptModel:
                "Copilot prompt-file `model` metadata must be a non-empty single model name when present (current value: `{{modelValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-prompt-model",
});

export default requireValidPromptModelRule;
