import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-model`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
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

const INLINE_LIST_LITERAL_PATTERN = /^\s*\[.*\]\s*$/u;

/** Rule module for `require-valid-agent-model`. */
const requireValidAgentModelRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
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

            if (isDefined(modelList) && modelList.length > 0) {
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
                    modelValue:
                        !isDefined(model) || model.trim().length === 0
                            ? "(empty)"
                            : model,
                },
                messageId: "invalidAgentModel",
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
                "require Copilot custom-agent `model` metadata to be a non-empty model name or non-empty prioritized model list when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-agent-model"),
        },
        messages: {
            invalidAgentModel:
                "Copilot custom agent `model` must be a non-empty model name or non-empty prioritized list of model names (current value: `{{modelValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-model",
});

export default requireValidAgentModelRule;
