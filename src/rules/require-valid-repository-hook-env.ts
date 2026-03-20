import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-repository-hook-env`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHookObjects,
    isJsonObject,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireValidRepositoryHookEnvRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const invalidHook = getRepositoryHookObjects(root).find(
                    ({ hook }) => {
                        const env = hook["env"];

                        return env !== undefined && !isJsonObject(env);
                    }
                );

                if (invalidHook === undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        env: formatJsonValue(invalidHook.hook["env"]),
                        eventName: invalidHook.eventName,
                    },
                    messageId: "invalidRepositoryHookEnv",
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
                "require repository hook `env` values to be JSON objects when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidRepositoryHookEnv:
                "Repository hook `env` for `{{eventName}}` must be a JSON object when present (current value: `{{env}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-repository-hook-env",
});

export default requireValidRepositoryHookEnvRule;
