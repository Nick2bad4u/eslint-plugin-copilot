import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-handoff-send`.
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

const VALID_BOOLEAN_FIELD_VALUES = new Set(["false", "true"]);

const requireValidAgentHandoffSendRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                return;
            }

            const handoffs = getFrontmatterObjectList(frontmatter, "handoffs");

            if (handoffs === undefined || handoffs.length === 0) {
                return;
            }

            for (const [index, handoff] of handoffs.entries()) {
                const rawSend = handoff["send"];

                if (rawSend === undefined) {
                    continue;
                }

                const normalizedSend = rawSend.trim().toLowerCase();

                if (VALID_BOOLEAN_FIELD_VALUES.has(normalizedSend)) {
                    continue;
                }

                reportAtDocumentStart(context, {
                    data: {
                        handoffNumber: String(index + 1),
                        sendValue:
                            rawSend.trim().length > 0 ? rawSend : "(empty)",
                    },
                    messageId: "invalidHandoffSend",
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
                "require Copilot custom-agent handoff `send` values to use documented boolean metadata when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidHandoffSend:
                "Copilot custom agent handoff #{{handoffNumber}} must use a boolean `send` value (`true` or `false`), not `{{sendValue}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-handoff-send",
});

export default requireValidAgentHandoffSendRule;
