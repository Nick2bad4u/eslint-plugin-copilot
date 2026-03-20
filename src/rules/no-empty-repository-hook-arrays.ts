import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `no-empty-repository-hook-arrays`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHookEventEntries,
    isJsonArray,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const noEmptyRepositoryHookArraysRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const emptyEntry = getRepositoryHookEventEntries(root).find(
                    ([, eventValue]) =>
                        isJsonArray(eventValue) && eventValue.length === 0
                );

                if (emptyEntry === undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        eventName: emptyEntry[0],
                    },
                    messageId: "emptyRepositoryHookArray",
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.strict", "copilot.configs.all"],
            description:
                "disallow empty repository hook arrays that opt into an event without any hook definitions.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            emptyRepositoryHookArray:
                "Repository hook event `{{eventName}}` should not be declared with an empty array.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-empty-repository-hook-arrays",
});

export default noEmptyRepositoryHookArraysRule;
