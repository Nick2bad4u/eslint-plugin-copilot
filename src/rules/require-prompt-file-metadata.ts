/**
 * @packageDocumentation
 * ESLint rule implementation for `require-prompt-file-metadata`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
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

const VALID_BUILT_IN_PROMPT_AGENTS = new Set([
    "agent",
    "ask",
    "plan",
]);

const requirePromptFileMetadataRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "prompt") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                reportAtDocumentStart(context, {
                    messageId: "missingFrontmatter",
                });
                return;
            }

            const description = getFrontmatterScalar(
                frontmatter,
                "description"
            );

            if (description === undefined) {
                reportAtDocumentStart(context, {
                    messageId: hasFrontmatterField(frontmatter, "description")
                        ? "emptyDescription"
                        : "missingDescription",
                });
                return;
            }

            if (hasFrontmatterField(frontmatter, "mode")) {
                reportAtDocumentStart(context, {
                    messageId: "deprecatedMode",
                });
                return;
            }

            const agent = getFrontmatterScalar(frontmatter, "agent");

            if (agent === undefined) {
                reportAtDocumentStart(context, {
                    messageId: hasFrontmatterField(frontmatter, "agent")
                        ? "emptyAgent"
                        : "missingAgent",
                });
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            if (agent === "agent") {
                if (tools !== undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    messageId: hasFrontmatterField(frontmatter, "tools")
                        ? "emptyTools"
                        : "missingTools",
                });
                return;
            }

            if (
                VALID_BUILT_IN_PROMPT_AGENTS.has(agent) &&
                hasFrontmatterField(frontmatter, "tools")
            ) {
                reportAtDocumentStart(context, {
                    data: { agent },
                    messageId: "unexpectedTools",
                });
            }
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: [
                "copilot.configs.minimal",
                "copilot.configs.recommended",
                "copilot.configs.strict",
                "copilot.configs.all",
            ],
            description:
                "require reusable Copilot prompt files to declare description, agent, and built-in agent-mode tools metadata.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            deprecatedMode:
                "Copilot prompt files should use `agent` instead of the deprecated `mode` frontmatter key.",
            emptyDescription:
                "Copilot prompt files must define a non-empty `description` frontmatter value.",
            emptyAgent:
                "Copilot prompt files must define a non-empty `agent` frontmatter value.",
            emptyTools:
                "Built-in `agent` Copilot prompt files must define a non-empty `tools` frontmatter list.",
            missingDescription:
                "Copilot prompt files must define a `description` frontmatter value.",
            missingFrontmatter:
                "Copilot prompt files must start with YAML frontmatter that declares at least `description` and `agent`.",
            missingAgent:
                "Copilot prompt files must define an `agent` frontmatter value.",
            missingTools:
                "Built-in `agent` Copilot prompt files must define a `tools` frontmatter list.",
            unexpectedTools:
                "Copilot prompt files should only declare `tools` when `agent` is the built-in `agent` mode (current agent: `{{agent}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-prompt-file-metadata",
});

export default requirePromptFileMetadataRule;
