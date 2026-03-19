/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-agent-hook-cwd`.
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

const ABSOLUTE_OR_NON_REPOSITORY_RELATIVE_CWD_PATTERN =
    /^(?:[A-Za-z]:($|[\\/])|[\\/]|~($|[\\/])|[A-Za-z][A-Za-z0-9+.-]*:\/\/)/u;

const isValidRelativeHookCwd = (cwd: string): boolean => {
    const trimmedCwd = cwd.trim();

    return (
        trimmedCwd.length > 0 &&
        !ABSOLUTE_OR_NON_REPOSITORY_RELATIVE_CWD_PATTERN.test(trimmedCwd)
    );
};

const requireRelativeAgentHookCwdRule: CopilotRuleModule = createCopilotRule({
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
                    const cwd = hook["cwd"]?.trim();

                    if (cwd === undefined || isValidRelativeHookCwd(cwd)) {
                        continue;
                    }

                    reportAtDocumentStart(context, {
                        data: {
                            currentValue: cwd.length > 0 ? cwd : "(empty)",
                            eventName,
                            hookNumber: String(index + 1),
                        },
                        messageId: "invalidHookCwd",
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
                "require Copilot custom-agent hook `cwd` values to stay relative to the repository root.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidHookCwd:
                "Copilot custom agent hook #{{hookNumber}} in `{{eventName}}` must use a non-empty repository-relative `cwd` value, not `{{currentValue}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-relative-agent-hook-cwd",
});

export default requireRelativeAgentHookCwdRule;
