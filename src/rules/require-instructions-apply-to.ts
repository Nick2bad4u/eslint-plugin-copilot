/**
 * @packageDocumentation
 * ESLint rule implementation for `require-instructions-apply-to`.
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

const requireInstructionsApplyToRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "instructions") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                reportAtDocumentStart(context, {
                    messageId: "missingFrontmatter",
                });
                return;
            }

            const applyToScalar = getFrontmatterScalar(frontmatter, "applyTo");
            const applyToList = getFrontmatterList(frontmatter, "applyTo");

            if (applyToScalar !== undefined || applyToList !== undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: hasFrontmatterField(frontmatter, "applyTo")
                    ? "emptyApplyTo"
                    : "missingApplyTo",
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
                "require path-specific Copilot instructions files to declare a non-empty `applyTo` frontmatter glob.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            emptyApplyTo:
                "Copilot instructions files must define a non-empty `applyTo` frontmatter value.",
            missingApplyTo:
                "Copilot instructions files must define an `applyTo` frontmatter value so they can be auto-attached for matching files.",
            missingFrontmatter:
                "Copilot instructions files must start with YAML frontmatter that declares at least `applyTo`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-instructions-apply-to",
});

export default requireInstructionsApplyToRule;
