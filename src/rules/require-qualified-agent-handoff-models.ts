import { isDefined, isEmpty } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-qualified-agent-handoff-models`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterObjectList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const isQualifiedModelName = (value: string): boolean => {
    const trimmedValue = value.trim();

    if (!trimmedValue.endsWith(")")) {
        return false;
    }

    const separatorIndex = trimmedValue.lastIndexOf(" (");

    if (separatorIndex <= 0) {
        return false;
    }

    const qualifier = trimmedValue.slice(separatorIndex + 2, -1).trim();

    return (
        qualifier.length > 0 &&
        !qualifier.includes("(") &&
        !qualifier.includes(")")
    );
};

/** Rule module for `require-qualified-agent-handoff-models`. */
const requireQualifiedAgentHandoffModelsRule: CopilotRuleModule =
    createCopilotRule({
        create: (context) =>
            createMarkdownDocumentListener(() => {
                if (!isCustomAgentFilePath(context.filename)) {
                    return;
                }

                const frontmatter = extractFrontmatter(context.sourceCode.text);

                if (frontmatter === null) {
                    return;
                }

                const handoffs = getFrontmatterObjectList(
                    frontmatter,
                    "handoffs"
                );

                if (!isDefined(handoffs) || isEmpty(handoffs)) {
                    return;
                }

                for (const [index, handoff] of handoffs.entries()) {
                    const model = handoff["model"]?.trim();

                    if (
                        !isDefined(model) ||
                        model.length === 0 ||
                        isQualifiedModelName(model)
                    ) {
                        continue;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            handoffNumber: String(index + 1),
                            model,
                        },
                        messageId: "unqualifiedHandoffModel",
                    });

                    return;
                }
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
                    "require Copilot custom-agent handoff models to use qualified `Model Name (vendor)` names.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
                url: createRuleDocsUrl(
                    "require-qualified-agent-handoff-models"
                ),
            },
            messages: {
                unqualifiedHandoffModel:
                    "Copilot custom agent handoff #{{handoffNumber}} should use a qualified `handoffs.model` name like `GPT-5 (copilot)`, not `{{model}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-qualified-agent-handoff-models",
    });

export default requireQualifiedAgentHandoffModelsRule;
