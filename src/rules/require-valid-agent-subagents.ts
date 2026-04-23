import { arrayJoin, isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-subagents`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterList,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const EMPTY_ARRAY_LITERAL = "[]";
const WILDCARD_AGENTS_LITERAL = "*";

const isValidExplicitAgentName = (value: string): boolean => {
    const trimmedValue = value.trim();

    return (
        trimmedValue.length > 0 &&
        trimmedValue !== EMPTY_ARRAY_LITERAL &&
        trimmedValue !== WILDCARD_AGENTS_LITERAL
    );
};

const formatAgentsValue = (
    scalarValue: string | undefined,
    listValue: readonly string[] | undefined
): string => {
    if (isDefined(scalarValue)) {
        return scalarValue;
    }

    if (isDefined(listValue)) {
        return `[${arrayJoin(listValue, ", ")}]`;
    }

    return "(empty)";
};

/** Rule module for `require-valid-agent-subagents`. */
const requireValidAgentSubagentsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "agents")
            ) {
                return;
            }

            const agentsScalar = getFrontmatterScalar(frontmatter, "agents");
            const allowedAgents = getFrontmatterList(frontmatter, "agents");

            if (
                agentsScalar === WILDCARD_AGENTS_LITERAL ||
                agentsScalar === EMPTY_ARRAY_LITERAL
            ) {
                return;
            }

            if (
                isDefined(allowedAgents) &&
                allowedAgents.length > 0 &&
                allowedAgents.every((agentName) =>
                    isValidExplicitAgentName(agentName)
                )
            ) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    agentsValue: formatAgentsValue(agentsScalar, allowedAgents),
                },
                messageId: "invalidAgentsField",
            });
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
                "require Copilot custom-agent `agents` metadata to be `*`, `[]`, or a non-empty list of explicit agent names.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-agent-subagents"),
        },
        messages: {
            invalidAgentsField:
                "Copilot custom agent `agents` metadata must be `*`, `[]`, or a non-empty list of agent names (current value: `{{agentsValue}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-subagents",
});

export default requireValidAgentSubagentsRule;
