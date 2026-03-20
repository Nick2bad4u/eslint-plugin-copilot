import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-chatmode-file-metadata`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireChatmodeFileMetadataRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "chatmode") {
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

            if (description !== undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: hasFrontmatterField(frontmatter, "description")
                    ? "emptyDescription"
                    : "missingDescription",
            });
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
                "require custom Copilot agent files and legacy chat mode files to declare a non-empty description in frontmatter.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            emptyDescription:
                "Copilot custom agent and legacy chat mode files must define a non-empty `description` frontmatter value.",
            missingDescription:
                "Copilot custom agent and legacy chat mode files must define a `description` frontmatter value.",
            missingFrontmatter:
                "Copilot custom agent and legacy chat mode files must start with YAML frontmatter that declares at least `description`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-chatmode-file-metadata",
});

export default requireChatmodeFileMetadataRule;
