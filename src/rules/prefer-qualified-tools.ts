/**
 * @packageDocumentation
 * ESLint rule implementation for `prefer-qualified-tools`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
import {
    extractFrontmatter,
    getFrontmatterList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const isQualifiedToolName = (toolName: string): boolean =>
    toolName.includes("/");

const preferQualifiedToolsRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            const fileKind = getCopilotFileKind(context.filename);

            if (fileKind !== "chatmode" && fileKind !== "prompt") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            if (tools === undefined) {
                return;
            }

            const firstUnqualifiedTool = tools.find(
                (toolName) => !isQualifiedToolName(toolName)
            );

            if (firstUnqualifiedTool === undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                data: { toolName: firstUnqualifiedTool },
                messageId: "preferQualifiedTool",
            });
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.all"],
            description:
                "prefer fully-qualified tool names in Copilot prompt files, custom agents, and legacy chat modes.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            preferQualifiedTool:
                "Prefer fully-qualified Copilot tool names in `tools` metadata. `{{toolName}}` should include a provider or tool-set prefix such as `search/codebase`.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-qualified-tools",
});

export default preferQualifiedToolsRule;
