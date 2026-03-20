import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-existing-relative-instructions-links`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { getCustomizationBodyWithOffset } from "../_internal/customization-body.js";
import { pathExists } from "../_internal/file-system.js";
import {
    extractMarkdownLinks,
    isRelativeWorkspaceLinkDestination,
    resolveMarkdownWorkspaceLink,
} from "../_internal/markdown-links.js";

const requireExistingRelativeInstructionsLinksRule: CopilotRuleModule =
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
                            !isRelativeWorkspaceLinkDestination(
                                link.destination
                            )
                        ) {
                            continue;
                        }

                        if (
                            pathExists(
                                resolveMarkdownWorkspaceLink(
                                    context.filename,
                                    link.destination
                                )
                            )
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
                            messageId: "missingInstructionsLinkTarget",
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
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require relative Markdown links in path-specific Copilot instructions files to resolve to existing workspace targets.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
            },
            messages: {
                missingInstructionsLinkTarget:
                    "Copilot instructions relative link `{{destination}}` does not resolve to an existing workspace path.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-existing-relative-instructions-links",
    });

export default requireExistingRelativeInstructionsLinksRule;
