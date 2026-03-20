import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-repository-hook-version`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    formatJsonValue,
    getRepositoryHooksVersionValue,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireValidRepositoryHookVersionRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return {
                Document() {
                    if (!isRepositoryHookFilePath(context.filename)) {
                        return;
                    }

                    const root = parseJsonText(context.sourceCode.text);
                    const versionValue = getRepositoryHooksVersionValue(root);

                    if (versionValue === 1) {
                        return;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            version: formatJsonValue(versionValue),
                        },
                        messageId: "invalidRepositoryHookVersion",
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
                    "require repository hook configuration files to declare `version: 1`.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidRepositoryHookVersion:
                    "Repository hook configuration files must declare `version: 1` (current value: `{{version}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-repository-hook-version",
    });

export default requireValidRepositoryHookVersionRule;
