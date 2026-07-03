import { isDefined, isInteger } from "ts-extras";

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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const isValidTimeoutSeconds = (value: unknown): value is number =>
    typeof value === "number" && isInteger(value) && value > 0;

/** Rule module for `require-valid-repository-hook-timeouts`. */
const requireValidRepositoryHookTimeoutsRule: CopilotRuleModule =
    createCopilotRule({
        create: (context) => ({
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const invalidHook = getRepositoryHookObjects(root).find(
                    ({ hook }) => {
                        const timeout = hook["timeoutSec"];

                        return (
                            isDefined(timeout) &&
                            !isValidTimeoutSeconds(timeout)
                        );
                    }
                );

                if (!isDefined(invalidHook)) {
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
        }),
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
                url: createRuleDocsUrl(
                    "require-valid-repository-hook-timeouts"
                ),
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
