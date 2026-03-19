/**
 * @packageDocumentation
 * ESLint rule implementation for `require-qualified-agent-handoff-models`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterObjectList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const QUALIFIED_MODEL_NAME_PATTERN = /.+\s\([^()]+\)$/u;

const requireQualifiedAgentHandoffModelsRule: CopilotRuleModule =
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

                const handoffs = getFrontmatterObjectList(
                    frontmatter,
                    "handoffs"
                );

                if (handoffs === undefined || handoffs.length === 0) {
                    return;
                }

                for (const [index, handoff] of handoffs.entries()) {
                    const model = handoff["model"]?.trim();

                    if (
                        model === undefined ||
                        model.length === 0 ||
                        QUALIFIED_MODEL_NAME_PATTERN.test(model)
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
                    "require Copilot custom-agent handoff models to use qualified `Model Name (vendor)` names.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
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
