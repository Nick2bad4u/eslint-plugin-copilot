import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getSkillDirectoryName,
    isValidSkillIdentifier,
} from "../_internal/copilot-customization-names.js";
import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-skill-directory-name`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireValidSkillDirectoryNameRule: CopilotRuleModule = createCopilotRule(
    {
        create(context) {
            return createMarkdownDocumentListener(() => {
                if (!isSkillFilePath(context.filename)) {
                    return;
                }

                const directoryName = getSkillDirectoryName(context.filename);

                if (isValidSkillIdentifier(directoryName)) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        directoryName,
                    },
                    messageId: "invalidSkillDirectoryName",
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
                    "require Copilot skill directory names to use the documented lowercase-hyphen form.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidSkillDirectoryName:
                    "Copilot skill directory names must use lowercase letters, digits, and hyphens only (current directory: `{{directoryName}}`).",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-skill-directory-name",
    }
);

export default requireValidSkillDirectoryNameRule;
