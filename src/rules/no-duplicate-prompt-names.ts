/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-prompt-names`.
 */
import path from "node:path";
import { arrayJoin, isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getPromptName,
    normalizeNameForComparison,
} from "../_internal/copilot-customization-names.js";
import { findRepositoryRoot } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { collectDuplicateNameGroups } from "../_internal/duplicate-names.js";
import {
    listFilesRecursively,
    readUtf8File,
} from "../_internal/file-system.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const normalizeRelativeFilePath = (
    repositoryRoot: string,
    filePath: string
): string => path.relative(repositoryRoot, filePath).replaceAll("\\", "/");

/** Rule module for `no-duplicate-prompt-names`. */
const noDuplicatePromptNamesRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            if (!context.filename.endsWith(".prompt.md")) {
                return;
            }

            const repositoryRoot = findRepositoryRoot(context.filename);
            const promptDirectory = path.join(
                repositoryRoot,
                ".github",
                "prompts"
            );
            const promptFiles = listFilesRecursively(
                promptDirectory,
                (filePath) => filePath.endsWith(".prompt.md")
            );
            const duplicateGroups = collectDuplicateNameGroups(
                promptFiles.map((filePath) => {
                    const sourceText =
                        context.filename === filePath
                            ? context.sourceCode.text
                            : readUtf8File(filePath);

                    return {
                        filePath,
                        name: getPromptName(
                            filePath,
                            extractFrontmatter(sourceText)
                        ),
                    };
                }),
                normalizeNameForComparison
            );
            const currentPromptName = getPromptName(
                context.filename,
                extractFrontmatter(context.sourceCode.text)
            );
            const duplicateGroup = duplicateGroups.get(
                normalizeNameForComparison(currentPromptName)
            );

            if (!isDefined(duplicateGroup)) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    files: arrayJoin(
                        duplicateGroup.map((entry) =>
                            normalizeRelativeFilePath(
                                repositoryRoot,
                                entry.filePath
                            )
                        ),
                        ", "
                    ),
                    name: currentPromptName,
                },
                messageId: "duplicatePromptName",
            });
        }),
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: [
                "copilot.configs.recommended",
                "copilot.configs.strict",
                "copilot.configs.all",
            ],
            description:
                "disallow duplicate effective prompt names across workspace prompt files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("no-duplicate-prompt-names"),
        },
        messages: {
            duplicatePromptName:
                "Copilot prompt name `{{name}}` is duplicated across prompt files: {{files}}.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-duplicate-prompt-names",
});

export default noDuplicatePromptNamesRule;
