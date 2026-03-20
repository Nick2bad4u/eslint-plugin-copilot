import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-repository-hook-arrays`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHookEventEntries,
    isJsonArray,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireRepositoryHookArraysRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const invalidEntry = getRepositoryHookEventEntries(root).find(
                    ([, eventValue]) => !isJsonArray(eventValue)
                );

                if (invalidEntry === undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        eventName: invalidEntry[0],
                        value: formatJsonValue(invalidEntry[1]),
                    },
                    messageId: "invalidRepositoryHookArray",
                });
            },
        };
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
                "require each repository hook event entry in `hooks` to be an array.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidRepositoryHookArray:
                "Repository hook event `{{eventName}}` must map to an array of hook definitions (current value: `{{value}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-repository-hook-arrays",
});

export default requireRepositoryHookArraysRule;
