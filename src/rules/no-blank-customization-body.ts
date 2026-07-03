import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `no-blank-customization-body`.
 */
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getMeaningfulMarkdownBody,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `no-blank-customization-body`. */
const noBlankCustomizationBodyRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            const fileKind = getCopilotFileKind(context.filename);

            if (fileKind === null || fileKind === "repository-instructions") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const bodyText = frontmatter?.body ?? context.sourceCode.text;

            if (getMeaningfulMarkdownBody(bodyText).length > 0) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "blankBody",
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
                "disallow blank bodies in Copilot customization files other than repository-wide instructions.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("no-blank-customization-body"),
        },
        messages: {
            blankBody:
                "Copilot customization files should include meaningful Markdown instructions in the document body, not only frontmatter or comments.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-blank-customization-body",
});

export default noBlankCustomizationBodyRule;
