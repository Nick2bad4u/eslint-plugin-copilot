import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-instructions-apply-to`.
 */
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

/** Rule module for `require-instructions-apply-to`. */
const requireInstructionsApplyToRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
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

            if (isDefined(applyToScalar) || isDefined(applyToList)) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: hasFrontmatterField(frontmatter, "applyTo")
                    ? "emptyApplyTo"
                    : "missingApplyTo",
            });
        }),
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
            url: createRuleDocsUrl("require-instructions-apply-to"),
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
