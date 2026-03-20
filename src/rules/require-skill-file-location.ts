/**
 * @packageDocumentation
 * ESLint rule implementation for `require-skill-file-location`.
 */
import * as path from "node:path";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { isValidSkillDefinitionLocation } from "../_internal/skill-files.js";

const requireSkillFileLocationRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (path.basename(context.filename) !== "SKILL.md") {
                return;
            }

            if (isValidSkillDefinitionLocation(context.filename)) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "invalidSkillLocation",
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
                "require project skill definition files to live at a documented `.github/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md` path.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            invalidSkillLocation:
                "Copilot skill definition files should live at `.github/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-skill-file-location",
});

export default requireSkillFileLocationRule;
