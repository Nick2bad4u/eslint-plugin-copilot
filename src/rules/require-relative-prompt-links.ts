import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-prompt-links`.
 */
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    extractMarkdownLinks,
    isInvalidWorkspaceLinkDestination,
} from "../_internal/markdown-links.js";

const isInvalidPromptWorkspaceLinkDestination = (
    destination: string
): boolean => {
    const normalizedDestination = destination.trim();

    if (normalizedDestination.length === 0) {
        return false;
    }

    const lowercaseDestination = normalizedDestination.toLowerCase();

    if (
        lowercaseDestination.startsWith("#") ||
        lowercaseDestination.startsWith("./") ||
        lowercaseDestination.startsWith("../")
    ) {
        return false;
    }

    if (
        lowercaseDestination.startsWith("/") ||
        lowercaseDestination.startsWith("\\") ||
        lowercaseDestination.startsWith("~/") ||
        lowercaseDestination.startsWith("~\\") ||
        lowercaseDestination.startsWith("file:")
    ) {
        return true;
    }

    return isInvalidWorkspaceLinkDestination(normalizedDestination);
};

const requireRelativePromptLinksRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return {
            root() {
                if (getCopilotFileKind(context.filename) !== "prompt") {
                    return;
                }

                const sourceText = context.sourceCode.text;
                const frontmatter = extractFrontmatter(sourceText);
                const body = frontmatter?.body ?? sourceText;
                const bodyOffset = sourceText.length - body.length;

                for (const link of extractMarkdownLinks(body, bodyOffset)) {
                    const { destination } = link;

                    if (!isInvalidPromptWorkspaceLinkDestination(destination)) {
                        continue;
                    }

                    context.report({
                        data: {
                            destination,
                        },
                        loc: {
                            end: context.sourceCode.getLocFromIndex(link.end),
                            start: context.sourceCode.getLocFromIndex(
                                link.start
                            ),
                        },
                        messageId: "nonRelativePromptLink",
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
                "require Copilot prompt files to use relative Markdown links for workspace files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            nonRelativePromptLink:
                "Copilot prompt files should reference workspace files with relative Markdown links, not `{{destination}}`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-relative-prompt-links",
});

export default requireRelativePromptLinksRule;
