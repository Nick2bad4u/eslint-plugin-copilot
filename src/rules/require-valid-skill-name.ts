import { isDefined } from "ts-extras";

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
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-valid-skill-name`. */
const requireValidSkillNameRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
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
                isDefined(skillName) &&
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
                "require Copilot skill `name` metadata to use the documented lowercase-hyphen identifier form.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-skill-name"),
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
