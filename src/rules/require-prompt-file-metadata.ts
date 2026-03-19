/**
 * @packageDocumentation
 * ESLint rule implementation for `require-prompt-file-metadata`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
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

const VALID_PROMPT_MODES = new Set([
    "agent",
    "ask",
    "edit",
]);

const requirePromptFileMetadataRule = createCopilotRule({
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

            const mode = getFrontmatterScalar(frontmatter, "mode");

            if (mode === undefined) {
                reportAtDocumentStart(context, {
                    messageId: hasFrontmatterField(frontmatter, "mode")
                        ? "emptyMode"
                        : "missingMode",
                });
                return;
            }

            if (!VALID_PROMPT_MODES.has(mode)) {
                reportAtDocumentStart(context, {
                    data: { mode },
                    messageId: "invalidMode",
                });
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            if (mode === "agent") {
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

            if (hasFrontmatterField(frontmatter, "tools")) {
                reportAtDocumentStart(context, {
                    data: { mode },
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
                "require reusable Copilot prompt files to declare description, mode, and agent-mode tools metadata.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            emptyDescription:
                "Copilot prompt files must define a non-empty `description` frontmatter value.",
            emptyMode:
                "Copilot prompt files must define a non-empty `mode` frontmatter value.",
            emptyTools:
                "Agent-mode Copilot prompt files must define a non-empty `tools` frontmatter list.",
            invalidMode:
                "Copilot prompt file mode `{{mode}}` is invalid. Use `ask`, `edit`, or `agent`.",
            missingDescription:
                "Copilot prompt files must define a `description` frontmatter value.",
            missingFrontmatter:
                "Copilot prompt files must start with YAML frontmatter that declares at least `description` and `mode`.",
            missingMode:
                "Copilot prompt files must define a `mode` frontmatter value.",
            missingTools:
                "Agent-mode Copilot prompt files must define a `tools` frontmatter list.",
            unexpectedTools:
                "Copilot prompt files should only declare `tools` when `mode` is `agent` (current mode: `{{mode}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-prompt-file-metadata",
});

export default requirePromptFileMetadataRule;
