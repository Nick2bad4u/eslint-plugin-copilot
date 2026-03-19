/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-invocation-controls`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const VALID_BOOLEAN_FIELD_VALUES = new Set(["false", "true"]);

const INVOCATION_CONTROL_FIELDS = [
    "disable-model-invocation",
    "user-invocable",
] as const;

const requireValidAgentInvocationControlsRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return createMarkdownDocumentListener(() => {
                if (!isCustomAgentFilePath(context.filename)) {
                    return;
                }

                const frontmatter = extractFrontmatter(context.sourceCode.text);

                if (frontmatter === null) {
                    return;
                }

                for (const fieldName of INVOCATION_CONTROL_FIELDS) {
                    if (!hasFrontmatterField(frontmatter, fieldName)) {
                        continue;
                    }

                    const fieldValue = getFrontmatterScalar(
                        frontmatter,
                        fieldName
                    );
                    const normalizedValue = fieldValue?.trim().toLowerCase();

                    if (
                        normalizedValue !== undefined &&
                        VALID_BOOLEAN_FIELD_VALUES.has(normalizedValue)
                    ) {
                        continue;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            currentValue:
                                fieldValue === undefined ||
                                fieldValue.trim().length === 0
                                    ? "(empty)"
                                    : fieldValue,
                            fieldName,
                        },
                        messageId: "invalidInvocationControl",
                    });

                    return;
                }
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
                    "require Copilot custom-agent invocation-control flags to use documented boolean values when present.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidInvocationControl:
                    "Copilot custom agent `{{fieldName}}` must use a boolean `true` or `false` value (current value: `{{currentValue}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-agent-invocation-controls",
    });

export default requireValidAgentInvocationControlsRule;
