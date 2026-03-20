import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-instructions-links`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { getCustomizationBodyWithOffset } from "../_internal/customization-body.js";
import {
    extractMarkdownLinks,
    isInvalidWorkspaceLinkDestination,
} from "../_internal/markdown-links.js";

const requireRelativeInstructionsLinksRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return {
                root() {
                    if (
                        getCopilotFileKind(context.filename) !== "instructions"
                    ) {
                        return;
                    }

                    const { body, offset } = getCustomizationBodyWithOffset(
                        context.sourceCode.text
                    );

                    for (const link of extractMarkdownLinks(body, offset)) {
                        if (
                            !isInvalidWorkspaceLinkDestination(link.destination)
                        ) {
                            continue;
                        }

                        context.report({
                            data: {
                                destination: link.destination,
                            },
                            loc: {
                                end: context.sourceCode.getLocFromIndex(
                                    link.end
                                ),
                                start: context.sourceCode.getLocFromIndex(
                                    link.start
                                ),
                            },
                            messageId: "nonRelativeInstructionsLink",
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
                    "require path-specific Copilot instructions files to use relative Markdown links for workspace files.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                nonRelativeInstructionsLink:
                    "Copilot instructions files should reference workspace files with relative Markdown links, not `{{destination}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-relative-instructions-links",
    });

export default requireRelativeInstructionsLinksRule;
