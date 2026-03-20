import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-skill-file-metadata`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterScalar,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireSkillFileMetadataRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                reportAtDocumentStart(context, {
                    messageId: "missingSkillFrontmatter",
                });
                return;
            }

            if (getFrontmatterScalar(frontmatter, "name") === undefined) {
                reportAtDocumentStart(context, {
                    messageId: "missingSkillName",
                });
                return;
            }

            if (
                getFrontmatterScalar(frontmatter, "description") === undefined
            ) {
                reportAtDocumentStart(context, {
                    messageId: "missingSkillDescription",
                });
            }
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
                "require Copilot skill definition files to declare `name` and `description` frontmatter.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            missingSkillDescription:
                "Copilot skill definition files must declare a non-empty `description` frontmatter value.",
            missingSkillFrontmatter:
                "Copilot skill definition files must start with YAML frontmatter that declares at least `name` and `description`.",
            missingSkillName:
                "Copilot skill definition files must declare a non-empty `name` frontmatter value.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-skill-file-metadata",
});

export default requireSkillFileMetadataRule;
