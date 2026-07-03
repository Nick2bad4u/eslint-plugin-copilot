import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-repository-hook-events`.
 */
import { isRepositoryHookFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { reportAtDocumentStart } from "../_internal/markdown-rule.js";
import {
    getRepositoryHookEventEntries,
    isRepositoryHookEventName,
    parseJsonText,
} from "../_internal/repository-hooks-json.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-valid-repository-hook-events`. */
const requireValidRepositoryHookEventsRule: CopilotRuleModule =
    createCopilotRule({
        create: (context) => ({
            Document() {
                if (!isRepositoryHookFilePath(context.filename)) {
                    return;
                }

                const root = parseJsonText(context.sourceCode.text);
                const invalidEventName = getRepositoryHookEventEntries(root)
                    .map(([eventName]) => eventName)
                    .find((eventName) => !isRepositoryHookEventName(eventName));

                if (!isDefined(invalidEventName)) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        eventName: invalidEventName,
                    },
                    messageId: "invalidRepositoryHookEvent",
                });
            },
        }),
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.recommended",
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require repository hook configuration files to use supported hook event names.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
                url: createRuleDocsUrl("require-valid-repository-hook-events"),
            },
            messages: {
                invalidRepositoryHookEvent:
                    "Repository hook configuration files should use a supported hook event name, not `{{eventName}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-repository-hook-events",
    });

export default requireValidRepositoryHookEventsRule;
