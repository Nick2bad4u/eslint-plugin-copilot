import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-hook-timeouts`.
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

const isNumericTimeoutValue = (value: string): boolean => {
    let decimalPointCount = 0;

    for (const character of value) {
        if (character === ".") {
            decimalPointCount += 1;

            if (decimalPointCount > 1) {
                return false;
            }

            continue;
        }

        if (character < "0" || character > "9") {
            return false;
        }
    }

    return value.length > 0 && !value.startsWith(".") && !value.endsWith(".");
};

const requireValidAgentHookTimeoutsRule: CopilotRuleModule = createCopilotRule({
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
                    const timeout = hook["timeout"]?.trim();

                    if (
                        timeout === undefined ||
                        timeout.length === 0 ||
                        isNumericTimeoutValue(timeout)
                    ) {
                        continue;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            eventName,
                            hookNumber: String(index + 1),
                            timeout,
                        },
                        messageId: "invalidHookTimeout",
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
                "require Copilot custom-agent hook `timeout` values to be numeric seconds when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidHookTimeout:
                "Copilot custom agent hook #{{hookNumber}} in `{{eventName}}` should use a numeric `timeout` value in seconds, not `{{timeout}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-hook-timeouts",
});

export default requireValidAgentHookTimeoutsRule;
