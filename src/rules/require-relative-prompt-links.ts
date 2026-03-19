/**
 * @packageDocumentation
 * ESLint rule implementation for `require-relative-prompt-links`.
 */
import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";

const FENCED_BACKTICK_CODE_BLOCK_PATTERN = /```[\s\S]*?```/gu;
const FENCED_TILDE_CODE_BLOCK_PATTERN = /~~~[\s\S]*?~~~/gu;
const INLINE_CODE_PATTERN = /`[^`\r\n]+`/gu;
const MARKDOWN_LINK_PATTERN = /(?<!!)\[[^\]\r\n]+\]\(([^)\r\n]+)\)/gu;
const WINDOWS_ABSOLUTE_PATH_PATTERN = /^[A-Za-z]:[\\/]/u;

const maskMarkdownCode = (text: string): string =>
    text
        .replaceAll(FENCED_BACKTICK_CODE_BLOCK_PATTERN, (match) =>
            match.replaceAll(/[^\r\n]/gu, " ")
        )
        .replaceAll(FENCED_TILDE_CODE_BLOCK_PATTERN, (match) =>
            match.replaceAll(/[^\r\n]/gu, " ")
        )
        .replaceAll(INLINE_CODE_PATTERN, (match) =>
            match.replaceAll(/[^\r\n]/gu, " ")
        );

const extractMarkdownLinkDestination = (rawDestination: string): string => {
    const trimmedDestination = rawDestination.trim();

    if (
        trimmedDestination.startsWith("<") &&
        trimmedDestination.endsWith(">")
    ) {
        return trimmedDestination.slice(1, -1).trim();
    }

    const [destination] = trimmedDestination.split(/\s+/u, 1);

    return destination?.trim() ?? "";
};

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

    return WINDOWS_ABSOLUTE_PATH_PATTERN.test(normalizedDestination);
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
                const maskedBody = maskMarkdownCode(body);
                const bodyOffset = sourceText.length - body.length;

                for (const match of maskedBody.matchAll(
                    MARKDOWN_LINK_PATTERN
                )) {
                    const matchedLink = match[0];
                    const rawDestination = match[1];
                    const matchIndex = match.index;

                    if (
                        matchedLink === undefined ||
                        rawDestination === undefined ||
                        matchIndex === undefined
                    ) {
                        continue;
                    }

                    const destination =
                        extractMarkdownLinkDestination(rawDestination);

                    if (!isInvalidPromptWorkspaceLinkDestination(destination)) {
                        continue;
                    }

                    const start = bodyOffset + matchIndex;
                    const end = start + matchedLink.length;

                    context.report({
                        data: {
                            destination,
                        },
                        loc: {
                            end: context.sourceCode.getLocFromIndex(end),
                            start: context.sourceCode.getLocFromIndex(start),
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
