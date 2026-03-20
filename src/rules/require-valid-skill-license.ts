import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-skill-license`.
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

const requireValidSkillLicenseRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "license")
            ) {
                return;
            }

            if (getFrontmatterScalar(frontmatter, "license") !== undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "invalidSkillLicense",
            });
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.strict", "copilot.configs.all"],
            description:
                "require optional Copilot skill `license` metadata to be a non-empty scalar when present.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            invalidSkillLicense:
                "Copilot skill `license` metadata must be a non-empty scalar when present.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-skill-license",
});

export default requireValidSkillLicenseRule;
