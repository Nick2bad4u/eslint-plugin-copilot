import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `no-blank-skill-body`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const noBlankSkillBodyRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const body = frontmatter?.body ?? context.sourceCode.text;

            if (body.trim().length > 0) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "blankSkillBody",
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
            description: "disallow blank Copilot skill definition bodies.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            blankSkillBody:
                "Copilot skill definition files should include a non-empty Markdown body with instructions, examples, or guidance.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-blank-skill-body",
});

export default noBlankSkillBodyRule;
