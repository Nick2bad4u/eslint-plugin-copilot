/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-skill-names`.
 */
import * as fs from "node:fs";
import * as path from "node:path";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getSkillName,
    normalizeNameForComparison,
} from "../_internal/copilot-customization-names.js";
import {
    findRepositoryRoot,
    isSkillFilePath,
} from "../_internal/copilot-file-kind.js";
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

const noDuplicateSkillNamesRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isSkillFilePath(context.filename)) {
                return;
            }

            const repositoryRoot = findRepositoryRoot(context.filename);
            const skillFiles = [
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
                skillFiles.map((filePath) => {
                    const sourceText =
                        context.filename === filePath
                            ? context.sourceCode.text
                            : fs.readFileSync(filePath, "utf8");

                    return {
                        filePath,
                        name: getSkillName(
                            filePath,
                            extractFrontmatter(sourceText)
                        ),
                    };
                }),
                normalizeNameForComparison
            );
            const currentSkillName = getSkillName(
                context.filename,
                extractFrontmatter(context.sourceCode.text)
            );
            const duplicateGroup = duplicateGroups.get(
                normalizeNameForComparison(currentSkillName)
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
                    name: currentSkillName,
                },
                messageId: "duplicateSkillName",
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
                "disallow duplicate effective skill names across project skill definition files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            duplicateSkillName:
                "Copilot skill name `{{name}}` is duplicated across skill files: {{files}}.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-duplicate-skill-names",
});

export default noDuplicateSkillNamesRule;
