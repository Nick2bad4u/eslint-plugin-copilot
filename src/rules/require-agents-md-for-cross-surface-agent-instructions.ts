/**
 * @packageDocumentation
 * ESLint rule implementation for `require-agents-md-for-cross-surface-agent-instructions`.
 */
import * as path from "node:path";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { pathExists } from "../_internal/file-system.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireAgentsMdForCrossSurfaceAgentInstructionsRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return createMarkdownDocumentListener(() => {
                const basename = path.basename(context.filename);

                if (basename !== "CLAUDE.md" && basename !== "GEMINI.md") {
                    return;
                }

                const siblingAgentsMdPath = path.join(
                    path.dirname(context.filename),
                    "AGENTS.md"
                );

                if (pathExists(siblingAgentsMdPath)) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        basename,
                    },
                    messageId: "missingAgentsMdSibling",
                });
            });
        },
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require `CLAUDE.md` and `GEMINI.md` agent-instructions files to be paired with a sibling `AGENTS.md` for broader cross-surface support.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                missingAgentsMdSibling:
                    "`{{basename}}` is less portable across Copilot surfaces without a sibling `AGENTS.md` file in the same directory.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-agents-md-for-cross-surface-agent-instructions",
    });

export default requireAgentsMdForCrossSurfaceAgentInstructionsRule;
