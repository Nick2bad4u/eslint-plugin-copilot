import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `prefer-fast-repository-hooks`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    DEFAULT_REPOSITORY_HOOK_TIMEOUT_SECONDS,
    getRepositoryHookObjects,
    isJsonNumber,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const preferFastRepositoryHooksRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const slowHook = getRepositoryHookObjects(root).find(
                    ({ hook }) => {
                        const timeout = hook["timeoutSec"];

                        return (
                            isJsonNumber(timeout) &&
                            timeout > DEFAULT_REPOSITORY_HOOK_TIMEOUT_SECONDS
                        );
                    }
                );

                if (slowHook === undefined) {
                    return;
                }

                const timeout = slowHook.hook["timeoutSec"];

                if (!isJsonNumber(timeout)) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        eventName: slowHook.eventName,
                        timeout: String(timeout),
                    },
                    messageId: "slowRepositoryHookTimeout",
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
                "enforce repository hooks staying at or below the default 30-second timeout unless a slower hook is truly necessary.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            slowRepositoryHookTimeout:
                "Repository hook `timeoutSec` for `{{eventName}}` is {{timeout}} seconds, which exceeds the default 30-second timeout budget.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-fast-repository-hooks",
});

export default preferFastRepositoryHooksRule;
