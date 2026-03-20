import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-instructions-apply-to-globs`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    hasUriScheme,
    isWindowsAbsolutePath,
} from "../_internal/file-system.js";
import {
    extractFrontmatter,
    getFrontmatterList,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const isValidApplyToGlob = (value: string): boolean => {
    const trimmedValue = value.trim();
    const lowercaseValue = trimmedValue.toLowerCase();

    return (
        trimmedValue.length > 0 &&
        trimmedValue !== "." &&
        trimmedValue !== ".." &&
        !trimmedValue.startsWith("./") &&
        !trimmedValue.startsWith("../") &&
        !trimmedValue.startsWith("#") &&
        !trimmedValue.includes("\\") &&
        !lowercaseValue.startsWith("/") &&
        !lowercaseValue.startsWith("~/") &&
        !lowercaseValue.startsWith("~\\") &&
        !isWindowsAbsolutePath(trimmedValue) &&
        !hasUriScheme(trimmedValue)
    );
};

const requireValidInstructionsApplyToGlobsRule: CopilotRuleModule =
    createCopilotRule({
        create(context) {
            return createMarkdownDocumentListener(() => {
                if (getCopilotFileKind(context.filename) !== "instructions") {
                    return;
                }

                const frontmatter = extractFrontmatter(context.sourceCode.text);

                if (
                    frontmatter === null ||
                    !hasFrontmatterField(frontmatter, "applyTo")
                ) {
                    return;
                }

                const applyToValues = [
                    ...(getFrontmatterList(frontmatter, "applyTo") ?? []),
                ];
                const applyToScalar = getFrontmatterScalar(
                    frontmatter,
                    "applyTo"
                );

                if (applyToScalar !== undefined) {
                    applyToValues.push(applyToScalar);
                }

                const invalidValue = applyToValues.find(
                    (value) => !isValidApplyToGlob(value)
                );

                if (invalidValue === undefined) {
                    return;
                }

                reportAtDocumentStart(context, {
                    data: {
                        applyTo: invalidValue,
                    },
                    messageId: "invalidApplyToGlob",
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
                    "require path-specific Copilot instructions `applyTo` metadata to use repository-relative glob patterns.",
                frozen: false,
                recommended: true,
                requiresTypeChecking: false,
            },
            messages: {
                invalidApplyToGlob:
                    "Copilot instructions `applyTo` metadata should use repository-relative glob patterns, not `{{applyTo}}`.",
            },
            schema: [],
            type: "problem",
        },
        name: "require-valid-instructions-apply-to-globs",
    });

export default requireValidInstructionsApplyToGlobsRule;
