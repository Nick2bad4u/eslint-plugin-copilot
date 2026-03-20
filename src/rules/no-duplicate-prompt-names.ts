import * as fs from "node:fs";
/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-prompt-names`.
 */
import * as path from "node:path";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getPromptName,
    normalizeNameForComparison,
} from "../_internal/copilot-customization-names.js";
import { findRepositoryRoot } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { collectDuplicateNameGroups } from "../_internal/duplicate-names.js";
import { listFilesRecursively } from "../_internal/file-system.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const normalizeRelativeFilePath = (
    repositoryRoot: string,
    filePath: string
): string => path.relative(repositoryRoot, filePath).replaceAll("\\", "/");

const noDuplicatePromptNamesRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
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
                            : fs.readFileSync(filePath, "utf8");

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

            if (duplicateGroup === undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    files: duplicateGroup
                        .map((entry) =>
                            normalizeRelativeFilePath(
                                repositoryRoot,
                                entry.filePath
                            )
                        )
                        .join(", "),
                    name: currentPromptName,
                },
                messageId: "duplicatePromptName",
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
                "disallow duplicate effective prompt names across workspace prompt files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
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
