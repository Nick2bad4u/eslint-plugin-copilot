import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-repository-hook-cwd`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { isNonRelativeWorkspacePath } from "../_internal/file-system.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHookObjects,
    isJsonString,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireRelativeRepositoryHookCwdRule: CopilotRuleModule =
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
                            const cwd = hook["cwd"];

                            return (
                                isJsonString(cwd) &&
                                isNonRelativeWorkspacePath(cwd)
                            );
                        }
                    );

                    if (invalidHook === undefined) {
                        return;
                    }

                    const cwd = invalidHook.hook["cwd"];

                    if (!isJsonString(cwd)) {
                        return;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            cwd,
                            eventName: invalidHook.eventName,
                        },
                        messageId: "nonRelativeRepositoryHookCwd",
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
                    "require repository hook `cwd` values to use repository-relative paths.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                nonRelativeRepositoryHookCwd:
                    "Repository hook `cwd` values for `{{eventName}}` should use repository-relative paths, not `{{cwd}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-relative-repository-hook-cwd",
    });

export default requireRelativeRepositoryHookCwdRule;
