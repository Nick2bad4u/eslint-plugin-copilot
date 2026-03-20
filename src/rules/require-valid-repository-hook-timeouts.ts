import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-repository-hook-timeouts`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHookObjects,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const isValidTimeoutSeconds = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value > 0;

const requireValidRepositoryHookTimeoutsRule: CopilotRuleModule =
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
                            const timeout = hook["timeoutSec"];

                            return (
                                timeout !== undefined &&
                                !isValidTimeoutSeconds(timeout)
                            );
                        }
                    );

                    if (invalidHook === undefined) {
                        return;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            eventName: invalidHook.eventName,
                            timeout: formatJsonValue(
                                invalidHook.hook["timeoutSec"]
                            ),
                        },
                        messageId: "invalidRepositoryHookTimeout",
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
                    "require repository hook `timeoutSec` values to be positive integers when present.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidRepositoryHookTimeout:
                    "Repository hook `timeoutSec` for `{{eventName}}` must be a positive integer when present (current value: `{{timeout}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-repository-hook-timeouts",
    });

export default requireValidRepositoryHookTimeoutsRule;
