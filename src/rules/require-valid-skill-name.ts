import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getSkillName,
    isValidSkillIdentifier,
} from "../_internal/copilot-customization-names.js";
import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-skill-name`.
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

const requireValidSkillNameRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "name")
            ) {
                return;
            }

            const skillName = getFrontmatterScalar(frontmatter, "name");

            if (
                skillName !== undefined &&
                isValidSkillIdentifier(
                    getSkillName(context.filename, frontmatter)
                )
            ) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    name: skillName ?? "(empty)",
                },
                messageId: "invalidSkillName",
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
                "require Copilot skill `name` metadata to use the documented lowercase-hyphen identifier form.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidSkillName:
                "Copilot skill `name` values must use lowercase letters, digits, and hyphens only (current value: `{{name}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-skill-name",
});

export default requireValidSkillNameRule;
