import { isDefined } from "ts-extras";

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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-valid-repository-hook-env`. */
const requireValidRepositoryHookEnvRule: CopilotRuleModule = createCopilotRule({
    create: (context) => ({
        Document() {
            if (!isRepositoryHookFilePath(context.filename)) {
                return;
            }

            const root = parseJsonText(context.sourceCode.text);
            const invalidHook = getRepositoryHookObjects(root).find(
                ({ hook }) => {
                    const env = hook["env"];

                    return isDefined(env) && !isJsonObject(env);
                }
            );

            if (!isDefined(invalidHook)) {
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
                "require repository hook `env` values to be JSON objects when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-repository-hook-env"),
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
