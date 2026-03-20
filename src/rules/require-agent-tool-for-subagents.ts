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

const hasAgentTool = (tools: readonly string[] | undefined): boolean =>
    tools?.some((toolName) => toolName.split("/").at(-1) === "agent") ?? false;

const requireAgentToolForSubagentsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
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
                (allowedAgents === undefined || allowedAgents.length === 0)
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
                "require custom agents that declare subagents to also include the `agent` tool.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
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
