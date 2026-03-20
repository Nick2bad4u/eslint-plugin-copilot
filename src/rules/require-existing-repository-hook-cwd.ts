import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-existing-repository-hook-cwd`.
 */
import {
    findRepositoryRoot,
    isRepositoryHookFilePath,
} from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    isRelativeWorkspacePath,
    pathExists,
    resolveRepositoryRelativePath,
} from "../_internal/file-system.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHookObjects,
    isJsonString,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";

const requireExistingRepositoryHookCwdRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return {
                Document() {
                    if (!isRepositoryHookFilePath(context.filename)) {
                        return;
                    }

                    const repositoryRoot = findRepositoryRoot(context.filename);
                    const root = parseJsonText(context.sourceCode.text);
                    const invalidHook = getRepositoryHookObjects(root).find(
                        ({ hook }) => {
                            const cwd = hook["cwd"];

                            return (
                                isJsonString(cwd) &&
                                cwd.trim().length > 0 &&
                                isRelativeWorkspacePath(cwd) &&
                                !pathExists(
                                    resolveRepositoryRelativePath(
                                        repositoryRoot,
                                        cwd
                                    )
                                )
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
                        messageId: "missingRepositoryHookCwd",
                    });
                },
            };
        },
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require repository hook `cwd` values to resolve to existing repository paths.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                missingRepositoryHookCwd:
                    "Repository hook `cwd` value `{{cwd}}` for `{{eventName}}` does not resolve to an existing repository path.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-existing-repository-hook-cwd",
    });

export default requireExistingRepositoryHookCwdRule;
