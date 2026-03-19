/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-handoffs`.
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

const requireValidAgentHandoffsRule: CopilotRuleModule = createCopilotRule({
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
                const handoffNumber = String(index + 1);
                const label = handoff["label"]?.trim() ?? "";
                const agent = handoff["agent"]?.trim() ?? "";
                const prompt = handoff["prompt"]?.trim() ?? "";
                const send = handoff["send"]?.trim().toLowerCase() ?? "";

                if (label.length === 0) {
                    reportAtDocumentStart(context, {
                        data: { handoffNumber },
                        messageId: "missingLabel",
                    });

                    return;
                }

                if (agent.length === 0) {
                    reportAtDocumentStart(context, {
                        data: { handoffNumber },
                        messageId: "missingAgent",
                    });

                    return;
                }

                if (send === "true" && prompt.length === 0) {
                    reportAtDocumentStart(context, {
                        data: { handoffNumber },
                        messageId: "missingPromptForAutoSend",
                    });

                    return;
                }
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
                "require Copilot custom-agent handoffs to define the metadata needed for usable guided transitions.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            missingAgent:
                "Copilot custom agent handoff #{{handoffNumber}} must define a non-empty `agent` target.",
            missingLabel:
                "Copilot custom agent handoff #{{handoffNumber}} must define a non-empty `label`.",
            missingPromptForAutoSend:
                "Copilot custom agent handoff #{{handoffNumber}} with `send: true` must also define a non-empty `prompt`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-handoffs",
});

export default requireValidAgentHandoffsRule;
