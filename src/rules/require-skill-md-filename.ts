import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { isSkillMarkdownFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-skill-md-filename`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import {
    getSkillFileBasename,
    looksLikeSkillDefinitionDocument,
} from "../_internal/skill-files.js";

const requireSkillMdFilenameRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillMarkdownFilePath(context.filename)) {
                return;
            }

            const basename = getSkillFileBasename(context.filename);

            if (basename === "SKILL.md") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (!looksLikeSkillDefinitionDocument(frontmatter)) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    basename,
                },
                messageId: "invalidSkillDefinitionFilename",
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
                "require markdown files that declare skill-definition frontmatter to use the documented `SKILL.md` filename.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidSkillDefinitionFilename:
                "Skill-definition markdown files should be named `SKILL.md`, not `{{basename}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-skill-md-filename",
});

export default requireSkillMdFilenameRule;
