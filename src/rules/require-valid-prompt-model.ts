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

const INLINE_LIST_LITERAL_PATTERN = /^\s*\[.*\]\s*$/u;

const formatPromptModelValue = (
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

            if (modelList !== undefined) {
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
                model !== undefined &&
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
                "require Copilot prompt-file `model` metadata to be a non-empty single model name when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
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
