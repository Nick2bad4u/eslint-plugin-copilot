import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-repository-hook-command-shell`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHookObjects,
    isJsonString,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const hasHookShellCommand = (value: unknown): boolean =>
    typeof value === "string" && value.trim().length > 0;

const requireRepositoryHookCommandShellRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return {
                Document() {
                    if (!isRepositoryHookFilePath(context.filename)) {
                        return;
                    }

                    const root = parseJsonText(context.sourceCode.text);
                    const invalidHook = getRepositoryHookObjects(root).find(
                        ({ hook }) =>
                            isJsonString(hook["type"]) &&
                            hook["type"] === "command" &&
                            !hasHookShellCommand(hook["bash"]) &&
                            !hasHookShellCommand(hook["powershell"])
                    );

                    if (invalidHook === undefined) {
                        return;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            eventName: invalidHook.eventName,
                        },
                        messageId: "missingRepositoryHookShellCommand",
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
                    "require repository `command` hook definitions to declare at least one shell command under `bash` or `powershell`.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                missingRepositoryHookShellCommand:
                    "Repository `command` hooks for `{{eventName}}` must declare a non-empty `bash` or `powershell` command.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-repository-hook-command-shell",
    });

export default requireRepositoryHookCommandShellRule;
