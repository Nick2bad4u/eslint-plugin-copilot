import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getSkillDirectoryName,
    getSkillName,
} from "../_internal/copilot-customization-names.js";
import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-skill-name-match-directory`.
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

const requireSkillNameMatchDirectoryRule: CopilotRuleModule = createCopilotRule(
    {
        create(context) {
            return createMarkdownDocumentListener(() => {
                if (!isSkillFilePath(context.filename)) {
                    return;
                }

                const frontmatter = extractFrontmatter(context.sourceCode.text);
                const explicitSkillName =
                    frontmatter === null
                        ? undefined
                        : getFrontmatterScalar(frontmatter, "name");

                if (explicitSkillName === undefined) {
                    return;
                }

                const skillName = getSkillName(context.filename, frontmatter);
                const directoryName = getSkillDirectoryName(context.filename);

                if (skillName === directoryName) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        directoryName,
                        name: skillName,
                    },
                    messageId: "skillNameDoesNotMatchDirectory",
                });
            });
        },
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require Copilot skill `name` metadata to match the skill directory name.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                skillNameDoesNotMatchDirectory:
                    "Copilot skill `name` value `{{name}}` should match its directory name `{{directoryName}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-skill-name-match-directory",
    }
);

export default requireSkillNameMatchDirectoryRule;
