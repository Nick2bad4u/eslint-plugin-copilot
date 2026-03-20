import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `no-legacy-chatmode-files`.
 */
import { isLegacyChatmodeFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const noLegacyChatmodeFilesRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isLegacyChatmodeFilePath(context.filename)) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "legacyChatmodeFile",
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
                "disallow legacy Copilot `.chatmode.md` files in favor of modern `.agent.md` custom agents.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            legacyChatmodeFile:
                "Legacy Copilot `.chatmode.md` files should be migrated to `.github/agents/*.agent.md` custom agents.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-legacy-chatmode-files",
});

export default noLegacyChatmodeFilesRule;
