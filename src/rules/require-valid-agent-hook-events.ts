import { isDefined, setHas } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-hook-events`.
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

const VALID_HOOK_EVENT_NAMES = new Set([
    "PostToolUse",
    "PreCompact",
    "PreToolUse",
    "SessionStart",
    "Stop",
    "SubagentStart",
    "SubagentStop",
    "UserPromptSubmit",
]);

/** Rule module for `require-valid-agent-hook-events`. */
const requireValidAgentHookEventsRule: CopilotRuleModule = createCopilotRule({
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

            for (const eventName of hookGroups.keys()) {
                if (setHas(VALID_HOOK_EVENT_NAMES, eventName)) {
                    continue;
                }

                reportAtDocumentStart(context, {
                    data: { eventName },
                    messageId: "invalidHookEvent",
                });

                return;
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
                "require Copilot custom-agent hooks to use supported VS Code hook event names.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-agent-hook-events"),
        },
        messages: {
            invalidHookEvent:
                "Copilot custom agent hooks should use a supported event name, not `{{eventName}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-hook-events",
});

export default requireValidAgentHookEventsRule;
