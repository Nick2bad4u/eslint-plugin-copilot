import { isDefined, setHas } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `prefer-qualified-tools`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterList,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const isQualifiedToolName = (toolName: string): boolean =>
    toolName.includes("/");

const allowedUnqualifiedToolNames = new Set(["agent", "runSubagent"]);

const isAllowedUnqualifiedToolName = (toolName: string): boolean =>
    setHas(allowedUnqualifiedToolNames, toolName);

/** Rule module for `prefer-qualified-tools`. */
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

            if (!isDefined(tools)) {
                return;
            }

            const firstUnqualifiedTool =
                tools.find(
                    (toolName) =>
                        !isQualifiedToolName(toolName) &&
                        !isAllowedUnqualifiedToolName(toolName)
                ) ?? null;

            if (firstUnqualifiedTool === null) {
                return;
            }

            reportAtDocumentStart(context, {
                data: { toolName: firstUnqualifiedTool },
                messageId: "preferQualifiedTool",
            });
        });
    },
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.all"],
            description:
                "enforce fully-qualified tool names in Copilot prompt files, custom agents, and legacy chat modes.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("prefer-qualified-tools"),
        },
        messages: {
            preferQualifiedTool:
                "Prefer fully-qualified Copilot tool names in `tools` metadata when a documented built-in alias is not required. `{{toolName}}` should include a provider or tool-set prefix such as `search/codebase`.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-qualified-tools",
});

export default preferQualifiedToolsRule;
