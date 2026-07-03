import { arrayAt, isDefined, isEmpty, stringSplit } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-agent-tool-for-subagents`.
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

const hasAgentTool = (tools: readonly string[] | undefined): boolean =>
    tools?.some(
        (toolName) => arrayAt(stringSplit(toolName, "/"), -1) === "agent"
    ) ?? false;

/** Rule module for `require-agent-tool-for-subagents`. */
const requireAgentToolForSubagentsRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                return;
            }

            if (!hasFrontmatterField(frontmatter, "agents")) {
                return;
            }

            const allowedAgents = getFrontmatterList(frontmatter, "agents");
            const agentsScalar = getFrontmatterScalar(frontmatter, "agents");

            if (
                agentsScalar !== "*" &&
                (!isDefined(allowedAgents) || isEmpty(allowedAgents))
            ) {
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            if (hasAgentTool(tools)) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: hasFrontmatterField(frontmatter, "tools")
                    ? "missingAgentTool"
                    : "missingTools",
            });
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
                "require custom agents that declare subagents to also include the `agent` tool.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-agent-tool-for-subagents"),
        },
        messages: {
            missingAgentTool:
                "Copilot custom agent files that declare `agents` must include the `agent` tool in `tools`.",
            missingTools:
                "Copilot custom agent files that declare `agents` must also declare a `tools` list that includes the `agent` tool.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-agent-tool-for-subagents",
});

export default requireAgentToolForSubagentsRule;
