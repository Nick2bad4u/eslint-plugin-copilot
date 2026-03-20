import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-repository-hook-command-type`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHookObjects,
    isJsonString,
    isRepositoryHookType,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireValidRepositoryHookCommandTypeRule: CopilotRuleModule =
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
                            const typeValue = hook["type"];

                            return (
                                !isJsonString(typeValue) ||
                                !isRepositoryHookType(typeValue)
                            );
                        }
                    );

                    if (invalidHook === undefined) {
                        return;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            eventName: invalidHook.eventName,
                            type: formatJsonValue(invalidHook.hook["type"]),
                        },
                        messageId: "invalidRepositoryHookType",
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
                    "require repository hook definitions to declare a supported `type` value such as `command` or `prompt`.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidRepositoryHookType:
                    "Repository hook definitions for `{{eventName}}` must declare a supported `type` such as `command` or `prompt` (current value: `{{type}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-repository-hook-command-type",
    });

export default requireValidRepositoryHookCommandTypeRule;
