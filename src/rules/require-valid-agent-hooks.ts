import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-hooks`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterObjectListGroups,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

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

const getInvalidHookReport = (
    eventName: string,
    hook: Readonly<Record<string, string>>,
    hookNumber: string
):
    | Readonly<{
          data: Readonly<Record<string, string>>;
          messageId: "invalidHookType" | "missingHookCommand";
      }>
    | undefined => {
    const type = hook["type"]?.trim() ?? "";

    if (type !== "command") {
        return {
            data: {
                eventName,
                hookNumber,
                type: type.length === 0 ? "(missing)" : type,
            },
            messageId: "invalidHookType",
        };
    }

    if (hasAnyHookCommand(hook)) {
        return undefined;
    }

    return {
        data: {
            eventName,
            hookNumber,
        },
        messageId: "missingHookCommand",
    };
};

/** Rule module for `require-valid-agent-hooks`. */
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

            if (!isDefined(hookGroups) || hookGroups.size === 0) {
                return;
            }

            for (const [eventName, hooks] of hookGroups) {
                for (const [index, hook] of hooks.entries()) {
                    const hookNumber = String(index + 1);
                    const invalidHookReport = getInvalidHookReport(
                        eventName,
                        hook,
                        hookNumber
                    );

                    if (!isDefined(invalidHookReport)) {
                        continue;
                    }

                    reportAtDocumentStart(context, invalidHookReport);

                    return;
                }
            }
        });
    },
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
            url: createRuleDocsUrl("require-valid-agent-hooks"),
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
