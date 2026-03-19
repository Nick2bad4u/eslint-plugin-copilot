/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-hooks`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterObjectListGroups,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const hasAnyHookCommand = (hook: Readonly<Record<string, string>>): boolean =>
    [
        "command",
        "windows",
        "linux",
        "osx",
    ].some((key) => {
        const value = hook[key];

        return typeof value === "string" && value.trim().length > 0;
    });

const requireValidAgentHooksRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                return;
            }

            const hookGroups = getFrontmatterObjectListGroups(
                frontmatter,
                "hooks"
            );

            if (hookGroups === undefined || hookGroups.size === 0) {
                return;
            }

            for (const [eventName, hooks] of hookGroups) {
                for (const [index, hook] of hooks.entries()) {
                    const hookNumber = String(index + 1);
                    const type = hook["type"]?.trim() ?? "";

                    if (type !== "command") {
                        reportAtDocumentStart(context, {
                            data: {
                                eventName,
                                hookNumber,
                                type: type.length === 0 ? "(missing)" : type,
                            },
                            messageId: "invalidHookType",
                        });

                        return;
                    }

                    if (hasAnyHookCommand(hook)) {
                        continue;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            eventName,
                            hookNumber,
                        },
                        messageId: "missingHookCommand",
                    });

                    return;
                }
            }
        });
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
                "require Copilot custom-agent hooks to use `type: command` and define at least one command property.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidHookType:
                "Copilot custom agent hook #{{hookNumber}} in `{{eventName}}` must use `type: command` (current value: `{{type}}`).",
            missingHookCommand:
                "Copilot custom agent hook #{{hookNumber}} in `{{eventName}}` must define at least one command property (`command`, `windows`, `linux`, or `osx`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-hooks",
});

export default requireValidAgentHooksRule;
