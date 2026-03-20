import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-string-repository-hook-env-values`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHookObjects,
    isJsonObject,
    isJsonString,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireStringRepositoryHookEnvValuesRule: CopilotRuleModule =
    createCopilotRule({
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

                            return (
                                isJsonObject(env) &&
                                Object.values(env).some(
                                    (value) => !isJsonString(value)
                                )
                            );
                        }
                    );

                    if (invalidHook === undefined) {
                        return;
                    }

                    const env = invalidHook.hook["env"];

                    reportAtDocumentStart(context, {
                        data: {
                            env: formatJsonValue(env),
                            eventName: invalidHook.eventName,
                        },
                        messageId: "nonStringRepositoryHookEnvValue",
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
                    "require repository hook `env` objects to use string values.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                nonStringRepositoryHookEnvValue:
                    "Repository hook `env` for `{{eventName}}` must use string values only (current value: `{{env}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-string-repository-hook-env-values",
    });

export default requireStringRepositoryHookEnvValuesRule;
