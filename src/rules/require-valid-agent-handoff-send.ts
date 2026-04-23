import { isDefined, isEmpty, setHas } from "ts-extras";

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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const VALID_BOOLEAN_FIELD_VALUES = new Set(["false", "true"]);

/** Rule module for `require-valid-agent-handoff-send`. */
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

            if (!isDefined(handoffs) || isEmpty(handoffs)) {
                return;
            }

            for (const [index, handoff] of handoffs.entries()) {
                const rawSend = handoff["send"];

                if (!isDefined(rawSend)) {
                    continue;
                }

                const normalizedSend = rawSend.trim().toLowerCase();

                if (setHas(VALID_BOOLEAN_FIELD_VALUES, normalizedSend)) {
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
            url: createRuleDocsUrl("require-valid-agent-handoff-send"),
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
