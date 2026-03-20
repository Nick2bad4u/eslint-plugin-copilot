import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-repository-hooks-object`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHooksValue,
    isJsonObject,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireRepositoryHooksObjectRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const hooksValue = getRepositoryHooksValue(root);

                if (isJsonObject(hooksValue)) {
                    return;
                }

                reportAtDocumentStart(context, {
                    messageId: "invalidRepositoryHooksObject",
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
                "require repository hook configuration files to declare a top-level `hooks` object.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidRepositoryHooksObject:
                "Repository hook configuration files must declare a top-level `hooks` object.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-repository-hooks-object",
});

export default requireRepositoryHooksObjectRule;
