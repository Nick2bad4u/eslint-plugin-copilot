/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-slash-command-names`.
 */
import path from "node:path";
import { arrayJoin, isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getPromptName,
    getSkillName,
    normalizeNameForComparison,
} from "../_internal/copilot-customization-names.js";
import {
    findRepositoryRoot,
    isSkillFilePath,
} from "../_internal/copilot-file-kind.js";
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

const isPromptOrSkillCommandFile = (filePath: string): boolean =>
    filePath.endsWith(".prompt.md") || isSkillFilePath(filePath);

const normalizeRelativeFilePath = (
    repositoryRoot: string,
    filePath: string
): string => path.relative(repositoryRoot, filePath).replaceAll("\\", "/");

/** Rule module for `no-duplicate-slash-command-names`. */
const noDuplicateSlashCommandNamesRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            if (!isPromptOrSkillCommandFile(context.filename)) {
                return;
            }

            const repositoryRoot = findRepositoryRoot(context.filename);
            const commandFiles = [
                ...listFilesRecursively(
                    path.join(repositoryRoot, ".github", "prompts"),
                    (filePath) => filePath.endsWith(".prompt.md")
                ),
                ...listFilesRecursively(
                    path.join(repositoryRoot, ".github", "skills"),
                    (filePath) => path.basename(filePath) === "SKILL.md"
                ),
                ...listFilesRecursively(
                    path.join(repositoryRoot, ".claude", "skills"),
                    (filePath) => path.basename(filePath) === "SKILL.md"
                ),
            ];
            const duplicateGroups = collectDuplicateNameGroups(
                commandFiles.map((filePath) => {
                    const sourceText =
                        context.filename === filePath
                            ? context.sourceCode.text
                            : readUtf8File(filePath);
                    const frontmatter = extractFrontmatter(sourceText);

                    return {
                        filePath,
                        name: filePath.endsWith(".prompt.md")
                            ? getPromptName(filePath, frontmatter)
                            : getSkillName(filePath, frontmatter),
                    };
                }),
                normalizeNameForComparison
            );
            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const currentCommandName = context.filename.endsWith(".prompt.md")
                ? getPromptName(context.filename, frontmatter)
                : getSkillName(context.filename, frontmatter);
            const duplicateGroup = duplicateGroups.get(
                normalizeNameForComparison(currentCommandName)
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
                    name: currentCommandName,
                },
                messageId: "duplicateSlashCommandName",
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
                "disallow duplicate slash-command names across prompt files and skills.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("no-duplicate-slash-command-names"),
        },
        messages: {
            duplicateSlashCommandName:
                "Slash command name `{{name}}` is duplicated across prompt or skill files: {{files}}.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-duplicate-slash-command-names",
});

export default noDuplicateSlashCommandNamesRule;
