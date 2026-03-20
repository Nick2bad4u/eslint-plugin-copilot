import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { isSkillFilePath } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-skill-links`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { getCustomizationBodyWithOffset } from "../_internal/customization-body.js";
import {
    extractMarkdownLinks,
    isInvalidWorkspaceLinkDestination,
} from "../_internal/markdown-links.js";

const requireRelativeSkillLinksRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            root() {
                if (!isSkillFilePath(context.filename)) {
                    return;
                }

                const { body, offset } = getCustomizationBodyWithOffset(
                    context.sourceCode.text
                );

                for (const link of extractMarkdownLinks(body, offset)) {
                    if (!isInvalidWorkspaceLinkDestination(link.destination)) {
                        continue;
                    }

                    context.report({
                        data: {
                            destination: link.destination,
                        },
                        loc: {
                            end: context.sourceCode.getLocFromIndex(link.end),
                            start: context.sourceCode.getLocFromIndex(
                                link.start
                            ),
                        },
                        messageId: "nonRelativeSkillLink",
                    });
                }
            },
        };
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
                "require Copilot skill definition files to use relative Markdown links for workspace resources.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            nonRelativeSkillLink:
                "Copilot skill definition files should reference workspace resources with relative Markdown links, not `{{destination}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-relative-skill-links",
});

export default requireRelativeSkillLinksRule;
